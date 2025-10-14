#!/usr/bin/env node

/**
 * GOALIE-X with Verification: Enhanced Research with Citation Grounding
 * Integrates intelligent query generation with verification workflows
 */

import { spawn, execSync } from 'child_process';
import dotenv from 'dotenv';
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoalieMCPClient } from './src/goalie-mcp-client.mjs';
import { VerificationConfig } from './src/verification-config.mjs';

// Import from original goalie-x
import {
  IntelligentQueryEngine,
  PerplexityClient
} from './goalie-x.mjs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

// Enhanced Output Manager with Verification Support
class VerifiedOutputManager {
  constructor(outputDir = 'docs/research') {
    this.outputDir = outputDir;
    this.ensureDirectory();
  }

  ensureDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  saveResults(synthesis, verification, format = 'both') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFilename = `verified-research-${timestamp}`;

    const files = [];

    if (format === 'json' || format === 'both') {
      const jsonPath = path.join(this.outputDir, `${baseFilename}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify({
        synthesis,
        verification,
        metadata: {
          generated: new Date().toISOString(),
          verificationEnabled: true
        }
      }, null, 2));
      files.push(jsonPath);
      console.log(`  💾 JSON: ${jsonPath}`);
    }

    if (format === 'markdown' || format === 'both') {
      const mdPath = path.join(this.outputDir, `${baseFilename}.md`);
      fs.writeFileSync(mdPath, this.formatMarkdownWithVerification(synthesis, verification));
      files.push(mdPath);
      console.log(`  💾 Markdown: ${mdPath}`);
    }

    return files;
  }

  formatMarkdownWithVerification(synthesis, verification) {
    let md = '# Verified Etymology and Cultural History Research\n\n';
    md += `Generated: ${new Date().toISOString()}\n\n`;

    // Verification Summary
    md += '## 🔒 Verification Summary\n\n';
    md += this.formatVerificationSummary(verification);
    md += '\n\n';

    // Confidence Scores
    if (verification.confidenceScores) {
      md += '## 📊 Confidence Scores\n\n';
      md += `Overall Confidence: **${(verification.confidenceScores.overall * 100).toFixed(1)}%**\n\n`;

      md += '### By Query\n\n';
      md += '| Query | Confidence | Citations | Quality | Verification |\n';
      md += '|-------|------------|-----------|---------|-------------|\n';

      for (const score of verification.confidenceScores.byQuery) {
        md += `| ${score.query.substring(0, 40)}... | ${(score.confidence * 100).toFixed(0)}% | ${(score.factors.citations * 100).toFixed(0)}% | ${(score.factors.quality * 100).toFixed(0)}% | ${(score.factors.verification * 100).toFixed(0)}% |\n`;
      }
      md += '\n\n';
    }

    // Research Summary
    md += '## Summary\n\n';
    md += this.createSummary(synthesis.content);
    md += '\n\n';

    // Detailed Results by Category
    md += '## Detailed Results by Category\n\n';

    for (const [category, contents] of Object.entries(synthesis.content)) {
      if (contents.length > 0) {
        md += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
        contents.forEach((item, i) => {
          md += `#### Result ${i + 1}\n\n`;

          // Add verification badge
          if (item.verification) {
            const verifiedCitations = item.verification.citationsVerified || 0;
            const confidence = item.verification.confidenceScore || 0;
            md += `**Verification:** `;
            md += `${verifiedCitations} citations verified | `;
            md += `${(confidence * 100).toFixed(0)}% confidence\n\n`;
          }

          md += `${item.content}\n\n`;

          // Add citations for this result
          if (item.citations && item.citations.length > 0) {
            md += `**Sources:**\n`;
            item.citations.slice(0, 5).forEach((citation, idx) => {
              const citationText = typeof citation === 'string'
                ? citation
                : (citation.title || citation.url || JSON.stringify(citation));
              md += `${idx + 1}. ${citationText}\n`;
            });
            md += '\n';
          }

          md += '---\n\n';
        });
      }
    }

    // Verification Details
    if (verification.citationGrounding) {
      md += '## 🔍 Citation Grounding Analysis\n\n';
      md += `- Total Claims: ${verification.citationGrounding.total}\n`;
      md += `- Verified Claims: ${verification.citationGrounding.verified}\n`;
      md += `- Unverified Claims: ${verification.citationGrounding.unverified}\n\n`;

      if (verification.citationGrounding.details && verification.citationGrounding.details.length > 0) {
        md += '### Unverified Claims\n\n';
        verification.citationGrounding.details.slice(0, 5).forEach(detail => {
          md += `- "${detail.claim}..." (from: ${detail.query})\n`;
        });
        md += '\n';
      }
    }

    // Self-Consistency Report
    if (verification.selfConsistency) {
      md += '## 🎯 Self-Consistency Analysis\n\n';
      md += `Consistency Score: **${(verification.selfConsistency.score * 100).toFixed(1)}%**\n\n`;

      if (verification.selfConsistency.contradictions && verification.selfConsistency.contradictions.length > 0) {
        md += '### Potential Contradictions\n\n';
        verification.selfConsistency.contradictions.slice(0, 3).forEach(contradiction => {
          md += `- Topic: ${contradiction.topic}\n`;
          md += `  - Query 1: ${contradiction.query1}\n`;
          md += `  - Query 2: ${contradiction.query2}\n`;
          md += `  - Note: ${contradiction.difference}\n\n`;
        });
      }
    }

    // Hallucination Detection
    if (verification.hallucinationDetection) {
      md += '## ⚠️ Hallucination Risk Assessment\n\n';
      md += `Risk Level: **${verification.hallucinationDetection.riskLevel.toUpperCase()}**\n`;
      md += `Risk Score: ${(verification.hallucinationDetection.score * 100).toFixed(1)}%\n\n`;

      if (verification.hallucinationDetection.flags && verification.hallucinationDetection.flags.length > 0) {
        md += '### Flagged Results\n\n';
        verification.hallucinationDetection.flags.forEach(flag => {
          md += `- **${flag.query}** (Risk: ${(flag.riskScore * 100).toFixed(0)}%)\n`;
          md += `  - Indicators: ${flag.indicators.join(', ')}\n\n`;
        });
      }
    }

    // All Citations
    if (synthesis.citations && synthesis.citations.length > 0) {
      md += '## 📚 All Citations\n\n';
      synthesis.citations.forEach((citation, i) => {
        const citationText = typeof citation === 'string'
          ? citation
          : (citation.title || citation.url || JSON.stringify(citation));
        md += `${i + 1}. ${citationText}\n`;
      });
      md += '\n';
    }

    return md;
  }

  formatVerificationSummary(verification) {
    let summary = '';

    summary += `**Total Results Analyzed:** ${verification.totalResults || 0}\n\n`;

    if (verification.citationGrounding) {
      const grounding = verification.citationGrounding;
      const verificationRate = grounding.total > 0
        ? ((grounding.verified / grounding.total) * 100).toFixed(1)
        : '0.0';
      summary += `- **Citation Grounding:** ${grounding.verified}/${grounding.total} claims verified (${verificationRate}%)\n`;
    }

    if (verification.selfConsistency) {
      summary += `- **Self-Consistency:** ${(verification.selfConsistency.score * 100).toFixed(1)}% consistent\n`;
    }

    if (verification.hallucinationDetection) {
      summary += `- **Hallucination Risk:** ${verification.hallucinationDetection.riskLevel}\n`;
    }

    if (verification.confidenceScores) {
      summary += `- **Overall Confidence:** ${(verification.confidenceScores.overall * 100).toFixed(1)}%\n`;
    }

    return summary;
  }

  createSummary(topics) {
    let summary = '';

    if (topics.etymology && topics.etymology.length > 0) {
      summary += '### Etymology and Linguistic Origins\n';
      const content = topics.etymology[0].content || topics.etymology[0];
      summary += content.substring(0, 500) + '...\n\n';
    }

    if (topics.cultural && topics.cultural.length > 0) {
      summary += '### Cultural Traditions and Practices\n';
      const content = topics.cultural[0].content || topics.cultural[0];
      summary += content.substring(0, 500) + '...\n\n';
    }

    if (topics.historical && topics.historical.length > 0) {
      summary += '### Historical Development\n';
      const content = topics.historical[0].content || topics.historical[0];
      summary += content.substring(0, 500) + '...\n\n';
    }

    if (topics.modern && topics.modern.length > 0) {
      summary += '### Modern and Contemporary Context\n';
      const content = topics.modern[0].content || topics.modern[0];
      summary += content.substring(0, 500) + '...\n\n';
    }

    return summary;
  }
}

// Main CLI with Verification
class GoalieXVerified {
  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  setupCommands() {
    this.program
      .name('goalie-x-verified')
      .description('GOALIE-X with verification workflows - citation grounding, self-consistency, anti-hallucination')
      .version('2.1.0');

    // Main verified search command
    this.program
      .command('search <query>')
      .description('Execute intelligent multi-query search with verification')
      .option('-m, --model <model>', 'Perplexity model', 'sonar-pro')
      .option('--mode <mode>', 'Search mode (academic/web)', 'academic')
      .option('-o, --output <dir>', 'Output directory', 'docs/research')
      .option('-f, --format <format>', 'Output format (json/markdown/both)', 'both')
      .option('-n, --num-queries <number>', 'Maximum number of queries', '5')
      .option('--verify', 'Enable verification workflows (default: true)', true)
      .option('--no-verify', 'Disable verification workflows')
      // Verification configuration options
      .option('--preset <preset>', 'Verification preset (strict/balanced/lenient/fast/etymology)', 'balanced')
      .option('--config <file>', 'Load verification config from JSON file')
      .option('--min-overlap <percent>', 'Minimum keyword overlap for citation matching (0-100)', parseFloat)
      .option('--verification-threshold <percent>', 'Citation verification threshold (0-100)', parseFloat)
      .option('--consistency-threshold <percent>', 'Self-consistency threshold (0-100)', parseFloat)
      .option('--show-config', 'Display verification configuration and exit')
      .action(async (query, options) => {
        await this.executeVerifiedSearch(query, options);
      });

    // Analyze command (unchanged)
    this.program
      .command('analyze <query>')
      .description('Analyze query and show generated searches without executing')
      .action(async (query) => {
        await this.analyzeQuery(query);
      });
  }

  async executeVerifiedSearch(query, options) {
    console.log('🚀 GOALIE-X with Verification');
    console.log('===============================\n');
    console.log('✨ Features: Citation Grounding | Self-Consistency | Anti-Hallucination\n');

    // Load verification configuration
    let config;
    if (options.config) {
      // Load from file
      config = VerificationConfig.fromFile(options.config);
      console.log(`📋 Loaded config from: ${options.config}\n`);
    } else if (options.preset) {
      // Load preset
      config = VerificationConfig.fromPreset(options.preset);
      console.log(`📋 Using preset: ${options.preset}\n`);
    } else {
      // Default balanced config
      config = new VerificationConfig();
    }

    // Apply CLI overrides
    if (options.minOverlap !== undefined) {
      config.citationGrounding.minKeywordOverlap = options.minOverlap / 100;
    }
    if (options.verificationThreshold !== undefined) {
      config.citationGrounding.verificationThreshold = options.verificationThreshold / 100;
    }
    if (options.consistencyThreshold !== undefined) {
      config.selfConsistency.consistencyThreshold = options.consistencyThreshold / 100;
    }

    // Show config and exit if requested
    if (options.showConfig) {
      console.log(config.toString());
      process.exit(0);
    }

    // Check API key
    if (!PERPLEXITY_API_KEY) {
      console.error('❌ Error: PERPLEXITY_API_KEY not set');
      console.error('   Please set PERPLEXITY_API_KEY in .env file');
      process.exit(1);
    }

    // Generate intelligent queries
    const maxQueries = parseInt(options.numQueries) || 5;
    const engine = new IntelligentQueryEngine();
    const queries = engine.generateQueries(query, maxQueries);

    console.log('\n📋 Generated Queries:');
    queries.forEach((q, i) => {
      console.log(`  ${i + 1}. ${q}`);
    });

    // Choose client based on verification flag
    const useVerification = options.verify !== false;

    let client, results, synthesis;

    if (useVerification) {
      console.log('\n🔒 Verification: ENABLED');
      console.log(`   Preset: ${options.preset || 'balanced'}`);
      console.log(`   Citation overlap: ${(config.citationGrounding.minKeywordOverlap * 100).toFixed(0)}%`);
      console.log(`   Verification threshold: ${(config.citationGrounding.verificationThreshold * 100).toFixed(0)}%`);
      console.log(`   Consistency threshold: ${(config.selfConsistency.consistencyThreshold * 100).toFixed(0)}%`);

      client = new GoalieMCPClient({
        enableReasoning: true,
        enableVerification: true,
        config: config
      });
    } else {
      console.log('\n⚠️  Verification: DISABLED');
      client = new PerplexityClient(PERPLEXITY_API_KEY);
    }

    try {
      // Execute searches
      results = await client.search(queries, options);

      // Synthesize results
      synthesis = client.synthesize();

      // Run verification workflows if enabled
      let verification = null;
      if (useVerification) {
        verification = await client.verifyResults(results);
      }

      // Save output
      const outputManager = useVerification
        ? new VerifiedOutputManager(options.output)
        : new VerifiedOutputManager(options.output); // Use same manager, just different formatting

      const files = useVerification
        ? outputManager.saveResults(synthesis, verification, options.format)
        : outputManager.saveResults(synthesis, { totalResults: results.length }, options.format);

      console.log('\n✅ Research Complete!');
      console.log(`📁 Results saved to: ${options.output}/`);

      // Display summary
      console.log('\n📊 Summary:');
      console.log(`  • Queries executed: ${synthesis.totalQueries}`);
      console.log(`  • Successful: ${synthesis.successfulQueries}`);
      console.log(`  • Citations collected: ${synthesis.citations.length}`);

      if (verification) {
        console.log('\n🔒 Verification Results:');
        console.log(`  • Citation grounding: ${verification.citationGrounding.verified}/${verification.citationGrounding.total}`);
        console.log(`  • Self-consistency: ${(verification.selfConsistency.score * 100).toFixed(1)}%`);
        console.log(`  • Hallucination risk: ${verification.hallucinationDetection.riskLevel}`);
        console.log(`  • Overall confidence: ${(verification.confidenceScores.overall * 100).toFixed(1)}%`);
      }

      files.forEach(file => console.log(`  • ${file}`));

    } catch (error) {
      console.error('\n❌ Error during search:', error.message);

      // Try to save partial results if available
      if (client.results && client.results.length > 0) {
        console.log('\n💾 Saving partial results...');
        const synthesis = client.synthesize();
        const verification = useVerification
          ? await client.verifyResults(client.results)
          : null;

        const outputManager = new VerifiedOutputManager(options.output);
        outputManager.saveResults(synthesis, verification || {}, options.format);
        console.log('✅ Partial results saved');
      }
    }
  }

  async analyzeQuery(query) {
    console.log('🔬 Query Analysis');
    console.log('=================\n');

    const engine = new IntelligentQueryEngine();
    const analysis = engine.analyzeInput(query);
    const queries = engine.generateQueries(query);

    console.log('📊 Analysis Results:');
    console.log(JSON.stringify(analysis, null, 2));

    console.log('\n📋 Generated Queries:');
    queries.forEach((q, i) => {
      console.log(`  ${i + 1}. ${q}`);
    });
  }

  run() {
    this.program.parse(process.argv);
  }
}

// Run if executed directly
const normalizedArgv = process.argv[1]?.replace(/\\/g, '/');
const normalizedUrl = fileURLToPath(import.meta.url).replace(/\\/g, '/');

if (normalizedUrl === normalizedArgv || process.argv[1]?.endsWith('goalie-x-verified.mjs')) {
  const app = new GoalieXVerified();
  app.run();
}

export { GoalieXVerified, GoalieMCPClient, VerifiedOutputManager };
