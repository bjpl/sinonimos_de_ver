/**
 * Supabase Edge Function: MD Simulation Worker
 * OpenMM-based molecular dynamics simulation executor
 * Tier 2: <5K atoms, <5 minutes, $0.50 per simulation
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface SimulationRequest {
  jobId: string;
  structureData: string;  // PDB content
  config: {
    atomCount: number;
    timestep: number;      // femtoseconds
    totalTime: number;     // picoseconds
    temperature: number;   // Kelvin
    ensemble: 'NVE' | 'NVT' | 'NPT';
  };
  userId: string;
}

interface SimulationProgress {
  jobId: string;
  progress: number;
  currentStep: number;
  totalSteps: number;
  estimatedTimeRemaining: number;
  status: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request
    const { jobId, structureData, config, userId }: SimulationRequest = await req.json();

    // Validate input
    if (!jobId || !structureData || !config || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate atom count
    if (config.atomCount > 5000) {
      return new Response(
        JSON.stringify({
          error: 'Atom count exceeds serverless tier limit of 5000 atoms',
          tier: 'desktop',
          recommendation: 'Use desktop export for larger systems'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Estimate runtime and cost
    const estimatedTimeSeconds = estimateSimulationTime(config.atomCount, config.totalTime);
    const estimatedCost = estimateCost(estimatedTimeSeconds);

    console.log(`Job ${jobId}: Estimated ${estimatedTimeSeconds}s, $${estimatedCost.toFixed(2)}`);

    // Enforce time limit
    if (estimatedTimeSeconds > 300) {
      return new Response(
        JSON.stringify({
          error: 'Estimated runtime exceeds 5 minute limit',
          estimated: estimatedTimeSeconds,
          recommendation: 'Reduce simulation time or use desktop export'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update job status to RUNNING
    await supabaseClient
      .from('md_jobs')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
        estimated_time_remaining: estimatedTimeSeconds
      })
      .eq('id', jobId);

    // Save structure data to storage
    const structurePath = `structures/${jobId}.pdb`;
    await supabaseClient.storage
      .from('simulations')
      .upload(structurePath, structureData, {
        contentType: 'chemical/x-pdb',
        upsert: true
      });

    // Create progress channel
    const progressChannel = supabaseClient.channel(`simulation:${jobId}`);

    // Execute OpenMM simulation
    const result = await runOpenMMSimulation({
      jobId,
      structurePath,
      config,
      onProgress: async (progress: SimulationProgress) => {
        // Update job progress in database
        await supabaseClient
          .from('md_jobs')
          .update({
            progress: progress.progress,
            estimated_time_remaining: progress.estimatedTimeRemaining
          })
          .eq('id', jobId);

        // Broadcast progress via Realtime
        await progressChannel.send({
          type: 'broadcast',
          event: 'progress',
          payload: progress
        });
      }
    });

    // Upload trajectory to storage
    const trajectoryPath = `trajectories/${jobId}.dcd`;
    await supabaseClient.storage
      .from('simulations')
      .upload(trajectoryPath, result.trajectoryData, {
        contentType: 'application/octet-stream',
        upsert: true
      });

    // Get public URL
    const { data: { publicUrl: trajectoryUrl } } = supabaseClient.storage
      .from('simulations')
      .getPublicUrl(trajectoryPath);

    // Upload energy data
    const energyPath = `energy/${jobId}.json`;
    await supabaseClient.storage
      .from('simulations')
      .upload(energyPath, JSON.stringify(result.energyData), {
        contentType: 'application/json',
        upsert: true
      });

    const { data: { publicUrl: energyUrl } } = supabaseClient.storage
      .from('simulations')
      .getPublicUrl(energyPath);

    // Update job status to COMPLETED
    await supabaseClient
      .from('md_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_url: trajectoryUrl,
        energy_plot_url: energyUrl,
        progress: 100,
        frame_count: result.frameCount,
        final_energy: result.finalEnergy,
        average_temperature: result.averageTemperature
      })
      .eq('id', jobId);

    // Track cost
    await supabaseClient
      .from('simulation_costs')
      .insert({
        job_id: jobId,
        user_id: userId,
        execution_time_seconds: result.executionTime,
        cost_usd: estimatedCost,
        atom_count: config.atomCount,
        created_at: new Date().toISOString()
      });

    // Broadcast completion
    await progressChannel.send({
      type: 'broadcast',
      event: 'complete',
      payload: {
        jobId,
        trajectoryUrl,
        energyUrl,
        frameCount: result.frameCount
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        jobId,
        trajectoryUrl,
        energyUrl,
        frameCount: result.frameCount,
        executionTime: result.executionTime,
        cost: estimatedCost
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Simulation error:', error);

    // Update job status to FAILED
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { jobId } = await req.json();

      if (jobId) {
        await supabaseClient
          .from('md_jobs')
          .update({
            status: 'failed',
            error_message: error.message,
            completed_at: new Date().toISOString()
          })
          .eq('id', jobId);
      }
    } catch (updateError) {
      console.error('Failed to update job status:', updateError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Run OpenMM simulation via Python subprocess
 */
async function runOpenMMSimulation(options: {
  jobId: string;
  structurePath: string;
  config: any;
  onProgress: (progress: SimulationProgress) => Promise<void>;
}) {
  const { jobId, structurePath, config, onProgress } = options;

  // Create temporary directory
  const tempDir = await Deno.makeTempDir();
  const inputPath = `${tempDir}/input.pdb`;
  const outputPath = `${tempDir}/output.dcd`;
  const energyPath = `${tempDir}/energy.json`;
  const logPath = `${tempDir}/simulation.log`;

  try {
    // Download structure from storage
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: structureData } = await supabaseClient.storage
      .from('simulations')
      .download(structurePath);

    if (!structureData) {
      throw new Error('Failed to download structure data');
    }

    await Deno.writeFile(inputPath, new Uint8Array(await structureData.arrayBuffer()));

    // Calculate total steps
    const totalSteps = Math.floor((config.totalTime * 1000) / config.timestep);

    // Create config file
    const configData = {
      input_pdb: inputPath,
      output_dcd: outputPath,
      energy_json: energyPath,
      log_file: logPath,
      timestep: config.timestep,
      total_steps: totalSteps,
      temperature: config.temperature,
      ensemble: config.ensemble,
      output_frequency: 100
    };

    const configPath = `${tempDir}/config.json`;
    await Deno.writeTextFile(configPath, JSON.stringify(configData, null, 2));

    // Execute Python script
    const process = new Deno.Command('python3', {
      args: ['/app/openmm-runner.py', configPath],
      stdout: 'piped',
      stderr: 'piped'
    });

    const startTime = Date.now();
    const child = process.spawn();

    // Monitor progress
    const progressMonitor = setInterval(async () => {
      try {
        const logContent = await Deno.readTextFile(logPath).catch(() => '');
        const match = logContent.match(/Step (\d+) of (\d+)/);

        if (match) {
          const currentStep = parseInt(match[1]);
          const totalSteps = parseInt(match[2]);
          const progress = Math.floor((currentStep / totalSteps) * 100);
          const elapsed = (Date.now() - startTime) / 1000;
          const estimatedTotal = (elapsed / currentStep) * totalSteps;
          const estimatedRemaining = Math.max(0, estimatedTotal - elapsed);

          await onProgress({
            jobId,
            progress,
            currentStep,
            totalSteps,
            estimatedTimeRemaining: Math.floor(estimatedRemaining),
            status: 'running'
          });
        }
      } catch (error) {
        console.error('Progress monitoring error:', error);
      }
    }, 5000);

    // Wait for completion
    const { code, stdout, stderr } = await child.output();
    clearInterval(progressMonitor);

    if (code !== 0) {
      const errorOutput = new TextDecoder().decode(stderr);
      throw new Error(`OpenMM simulation failed: ${errorOutput}`);
    }

    const executionTime = (Date.now() - startTime) / 1000;

    // Read results
    const trajectoryData = await Deno.readFile(outputPath);
    const energyData = JSON.parse(await Deno.readTextFile(energyPath));

    return {
      trajectoryData,
      energyData,
      frameCount: energyData.frames.length,
      finalEnergy: energyData.frames[energyData.frames.length - 1].energy,
      averageTemperature: energyData.average_temperature,
      executionTime
    };

  } finally {
    // Cleanup temp directory
    try {
      await Deno.remove(tempDir, { recursive: true });
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

/**
 * Estimate simulation time in seconds
 */
function estimateSimulationTime(atomCount: number, totalTimePs: number): number {
  // Empirical formula: time = atoms * picoseconds * factor
  // Based on: 1000 atoms, 100ps = ~60s on serverless
  const baseTimePerAtomPerPs = 0.0006;
  return Math.ceil(atomCount * totalTimePs * baseTimePerAtomPerPs);
}

/**
 * Estimate cost in USD
 */
function estimateCost(executionTimeSeconds: number): number {
  // Supabase Edge Functions: $2 per 1M GB-seconds
  // Assuming 2GB memory allocation
  const gbSeconds = (executionTimeSeconds * 2) / 1_000_000;
  return gbSeconds * 2;
}
