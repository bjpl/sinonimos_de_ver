/**
 * Mock Edge TTS Audio Generator Service
 * Simulates Python edge-tts execution for testing
 */

export class MockAudioGenerator {
  constructor() {
    this.voices = {
      mx_female_1: 'es-MX-DaliaNeural',
      mx_male_1: 'es-MX-JorgeNeural',
      co_female_1: 'es-CO-SalomeNeural',
      co_male_1: 'es-CO-GonzaloNeural',
      ar_female_1: 'es-AR-ElenaNeural',
      ar_male_1: 'es-AR-TomasNeural',
      us_female_1: 'es-US-PalomaNeural',
      us_male_1: 'es-US-AlonsoNeural'
    };

    this.voicePool = Object.keys(this.voices);
    this.currentVoiceIndex = 0;
    this.callCount = 0;
    this.generatedAudio = [];
    this.shouldFail = false;
    this.failureType = null;
    this.generationDelay = 0;
    this.isInstalled = true;
  }

  /**
   * Get next voice in rotation
   */
  getNextVoice() {
    const voiceId = this.voicePool[this.currentVoiceIndex];
    this.currentVoiceIndex = (this.currentVoiceIndex + 1) % this.voicePool.length;
    return voiceId;
  }

  /**
   * Mock generate audio
   */
  async generateAudio(text, outputPath, voiceId = null) {
    this.callCount++;

    const selectedVoiceId = voiceId || this.getNextVoice();
    const voice = this.voices[selectedVoiceId];

    if (!voice) {
      throw new Error(`Unknown voice ID: ${selectedVoiceId}`);
    }

    if (this.shouldFail) {
      return this._simulateFailure();
    }

    await this._delay(this.generationDelay);

    const result = {
      file: outputPath,
      voice: selectedVoiceId,
      voiceName: voice,
      text: text,
      timestamp: new Date().toISOString()
    };

    this.generatedAudio.push(result);
    return result;
  }

  /**
   * Mock generate with Python
   */
  async generateWithPython(text, outputPath, voiceId = null) {
    return this.generateAudio(text, outputPath, voiceId);
  }

  /**
   * Mock generate all audio for synonyms
   */
  async generateAll(synonyms, outputDir) {
    const audioMetadata = {
      verbs: {},
      examples: {},
      narratives: {},
      voices: {},
      generatedAt: new Date().toISOString()
    };

    // Add voice metadata
    for (const [voiceId, voiceName] of Object.entries(this.voices)) {
      const [region, gender] = voiceId.split('_');
      audioMetadata.voices[voiceId] = {
        name: voiceName,
        region: region.toUpperCase(),
        gender: gender
      };
    }

    for (const synonym of synonyms) {
      const verb = synonym.verb;
      const voiceId = this.getNextVoice();

      try {
        // Generate verb audio
        const verbPath = `${outputDir}/assets/audio/verbs/${verb}.mp3`;
        await this.generateWithPython(verb, verbPath, voiceId);

        audioMetadata.verbs[verb] = {
          file: `assets/audio/verbs/${verb}.mp3`,
          voice: voiceId,
          text: verb
        };

        // Generate example audio
        audioMetadata.examples[verb] = [];
        if (synonym.examples && synonym.examples.length > 0) {
          for (let i = 0; i < synonym.examples.length; i++) {
            const example = synonym.examples[i];
            const examplePath = `${outputDir}/assets/audio/examples/${verb}_example_${i + 1}.mp3`;

            await this.generateWithPython(example, examplePath, voiceId);

            audioMetadata.examples[verb].push({
              file: `assets/audio/examples/${verb}_example_${i + 1}.mp3`,
              voice: voiceId,
              text: example
            });
          }
        }

        // Generate narrative audio
        if (synonym.narrativeExperience && synonym.narrativeExperience.parts) {
          audioMetadata.narratives[verb] = [];

          for (let i = 0; i < synonym.narrativeExperience.parts.length; i++) {
            const part = synonym.narrativeExperience.parts[i];
            const narrativePath = `${outputDir}/assets/audio/narratives/${verb}_narrativa_${i + 1}.mp3`;

            await this.generateWithPython(part, narrativePath, voiceId);

            audioMetadata.narratives[verb].push({
              file: `assets/audio/narratives/${verb}_narrativa_${i + 1}.mp3`,
              voice: voiceId,
              text: part,
              partNumber: i + 1
            });
          }
        }

        await this.sleep(10); // Small delay

      } catch (error) {
        audioMetadata.verbs[verb] = { error: error.message };
      }
    }

    return audioMetadata;
  }

  /**
   * Mock check installation
   */
  async checkInstallation() {
    await this._delay(10);
    return this.isInstalled;
  }

  /**
   * Mock ensure installed
   */
  async ensureInstalled() {
    const isInstalled = await this.checkInstallation();

    if (!isInstalled) {
      if (this.shouldFail && this.failureType === 'install') {
        throw new Error('Failed to install edge-tts');
      }

      await this._delay(100);
      this.isInstalled = true;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // === Test Helper Methods ===

  /**
   * Configure mock to fail
   */
  setFailure(shouldFail, type = 'generation') {
    this.shouldFail = shouldFail;
    this.failureType = type;
  }

  /**
   * Set installation status
   */
  setInstalled(installed) {
    this.isInstalled = installed;
  }

  /**
   * Set generation delay for testing timeouts
   */
  setGenerationDelay(ms) {
    this.generationDelay = ms;
  }

  /**
   * Reset mock state
   */
  reset() {
    this.callCount = 0;
    this.generatedAudio = [];
    this.currentVoiceIndex = 0;
    this.shouldFail = false;
    this.failureType = null;
    this.generationDelay = 0;
    this.isInstalled = true;
  }

  /**
   * Get call statistics
   */
  getStats() {
    const voiceUsage = {};
    this.generatedAudio.forEach(audio => {
      voiceUsage[audio.voice] = (voiceUsage[audio.voice] || 0) + 1;
    });

    return {
      totalCalls: this.callCount,
      audioGenerated: this.generatedAudio.length,
      voiceUsage: voiceUsage,
      uniqueTexts: new Set(this.generatedAudio.map(a => a.text)).size
    };
  }

  /**
   * Get generated audio by criteria
   */
  getGeneratedAudio(filter = {}) {
    let results = [...this.generatedAudio];

    if (filter.voice) {
      results = results.filter(a => a.voice === filter.voice);
    }

    if (filter.text) {
      results = results.filter(a => a.text.includes(filter.text));
    }

    if (filter.path) {
      results = results.filter(a => a.file.includes(filter.path));
    }

    return results;
  }

  // === Private Helper Methods ===

  _simulateFailure() {
    switch (this.failureType) {
      case 'generation':
        throw new Error('edge-tts failed: Command not found');
      case 'python':
        throw new Error('Failed to spawn edge-tts: Python not installed');
      case 'voice':
        throw new Error('edge-tts failed: Invalid voice');
      case 'install':
        throw new Error('Failed to install edge-tts: pip not found');
      case 'timeout':
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Generation timeout')), 5000);
        });
      default:
        throw new Error('Unknown error occurred');
    }
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Factory functions for common test scenarios

export function createMockAudioGenerator(config = {}) {
  const generator = new MockAudioGenerator();

  if (config.shouldFail) {
    generator.setFailure(true, config.failureType);
  }

  if (config.isInstalled !== undefined) {
    generator.setInstalled(config.isInstalled);
  }

  if (config.generationDelay) {
    generator.setGenerationDelay(config.generationDelay);
  }

  return generator;
}

export function createFailingAudioGenerator(failureType = 'generation') {
  return createMockAudioGenerator({ shouldFail: true, failureType });
}

export default MockAudioGenerator;
