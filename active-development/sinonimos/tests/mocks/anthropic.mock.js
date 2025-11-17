/**
 * Mock Anthropic Claude AI Service
 * Provides realistic mock responses for content generation testing
 */

export class MockContentGenerator {
  constructor() {
    this.apiKey = 'mock-anthropic-key';
    this.model = 'claude-sonnet-4-20250514';
    this.callCount = 0;
    this.callHistory = [];
    this.shouldFail = false;
    this.failureType = null;
    this.customResponse = null;
    this.responseDelay = 0;
  }

  /**
   * Mock generate synonyms
   */
  async generateSynonyms(verb, count = 10) {
    this.callCount++;
    this.callHistory.push({ verb, count, timestamp: new Date() });

    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    if (this.shouldFail) {
      return this._simulateFailure();
    }

    await this._delay(this.responseDelay);

    if (this.customResponse) {
      return this.customResponse;
    }

    return this._generateMockSynonyms(verb, count);
  }

  /**
   * Mock build prompt (same as real implementation)
   */
  buildPrompt(verb, count) {
    return `Generate ${count} Spanish synonyms for the verb "${verb}" in JSON format...`;
  }

  /**
   * Mock Claude API call
   */
  async callClaude(prompt) {
    this.callCount++;

    if (this.shouldFail) {
      return this._simulateFailure();
    }

    await this._delay(this.responseDelay);

    // Return mock Claude response format
    return JSON.stringify([
      {
        verb: 'ejemplo',
        pronunciation: 'e-jem-plo',
        quickDefinition: 'Mock definition',
        definition: 'Mock detailed definition for testing purposes',
        formality: 'neutral',
        context: 'cotidiano',
        regions: ['general'],
        examples: [
          'Este es un ejemplo.',
          'Aquí tienes otro ejemplo.',
          'Un último ejemplo para completar.'
        ],
        culturalNotes: 'Mock cultural notes about usage in Latin America'
      }
    ]);
  }

  /**
   * Mock parse synonym response
   */
  parseSynonymResponse(response) {
    try {
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) ||
                       response.match(/\[[\s\S]*\]/);

      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const synonyms = JSON.parse(jsonStr);

      if (!Array.isArray(synonyms)) {
        throw new Error('Response is not an array');
      }

      for (const synonym of synonyms) {
        if (!synonym.image) {
          synonym.image = `assets/images/synonyms/${synonym.verb}.jpg`;
        }
      }

      return synonyms;

    } catch (error) {
      throw new Error(`Failed to parse synonym data: ${error.message}`);
    }
  }

  /**
   * Mock enhance synonym
   */
  async enhanceSynonym(synonym) {
    this.callCount++;

    if (this.shouldFail) {
      return this._simulateFailure();
    }

    await this._delay(this.responseDelay);

    return {
      ...synonym,
      definition: `Enhanced: ${synonym.definition}`,
      culturalNotes: `Enhanced: ${synonym.culturalNotes || 'Added cultural context'}`
    };
  }

  // === Test Helper Methods ===

  /**
   * Configure mock to fail
   */
  setFailure(shouldFail, type = 'api_error') {
    this.shouldFail = shouldFail;
    this.failureType = type;
  }

  /**
   * Set custom response for testing specific scenarios
   */
  setCustomResponse(response) {
    this.customResponse = response;
  }

  /**
   * Set response delay for testing timeouts
   */
  setResponseDelay(ms) {
    this.responseDelay = ms;
  }

  /**
   * Reset mock state
   */
  reset() {
    this.callCount = 0;
    this.callHistory = [];
    this.shouldFail = false;
    this.failureType = null;
    this.customResponse = null;
    this.responseDelay = 0;
  }

  /**
   * Get call statistics
   */
  getStats() {
    return {
      totalCalls: this.callCount,
      history: this.callHistory,
      averageCount: this.callHistory.length > 0
        ? this.callHistory.reduce((sum, call) => sum + call.count, 0) / this.callHistory.length
        : 0
    };
  }

  // === Private Helper Methods ===

  _generateMockSynonyms(verb, count) {
    const synonyms = [];
    const formalityLevels = ['formal', 'neutral', 'informal'];
    const contexts = ['cotidiano', 'literario', 'narrativo', 'profesional'];

    for (let i = 0; i < count; i++) {
      const isLiterary = i < 2; // First 2 are literary
      const context = isLiterary ? 'literario' : contexts[i % contexts.length];

      const synonym = {
        verb: `${verb}_synonym_${i + 1}`,
        pronunciation: this._generatePronunciation(`${verb}_synonym_${i + 1}`),
        quickDefinition: `Mock quick definition for synonym ${i + 1}`,
        definition: `This is a detailed mock definition explaining the nuances and usage patterns of synonym ${i + 1} for the verb ${verb}. It provides context and examples of when to use this particular word.`,
        formality: formalityLevels[i % 3],
        context: context,
        regions: i % 2 === 0 ? ['general'] : ['México', 'Centroamérica'],
        examples: [
          `Ejemplo 1 usando ${verb}_synonym_${i + 1} en contexto natural.`,
          `Aquí vemos ${verb}_synonym_${i + 1} en una oración diferente.`,
          `Un último ejemplo con ${verb}_synonym_${i + 1} para completar.`
        ],
        culturalNotes: `Mock cultural notes explaining the usage of this synonym in Latin American Spanish, particularly in ${i % 2 === 0 ? 'general' : 'Mexican and Central American'} contexts.`,
        image: `assets/images/synonyms/${verb}_synonym_${i + 1}.jpg`
      };

      // Add narrative experience for literary context
      if (isLiterary) {
        synonym.narrativeExperience = {
          title: `Mock Narrative for ${verb}_synonym_${i + 1}`,
          parts: [
            `En el primer párrafo, exploramos el uso literario de "${verb}_synonym_${i + 1}" en un contexto poético y evocador.`,
            `El segundo párrafo continúa desarrollando la narrativa, mostrando cómo esta palabra funciona en prosa literaria.`,
            `Finalmente, el tercer párrafo concluye la experiencia narrativa, demostrando el poder expresivo de esta palabra en la literatura española.`
          ],
          literaryNote: `This mock note explains how "${verb}_synonym_${i + 1}" functions in Spanish literature, its significance in literary contexts, and why writers choose this particular word for artistic expression.`
        };
      }

      synonyms.push(synonym);
    }

    return synonyms;
  }

  _generatePronunciation(word) {
    // Simple syllable breakdown
    const syllables = word.match(/.{1,3}/g) || [word];
    return syllables.join('-');
  }

  _simulateFailure() {
    switch (this.failureType) {
      case 'api_error':
        throw new Error('Claude API error: Authentication failed');
      case 'rate_limit':
        throw new Error('Claude API error: Rate limit exceeded');
      case 'network':
        throw new Error('Request failed: ECONNREFUSED');
      case 'timeout':
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 5000);
        });
      case 'invalid_json':
        throw new Error('Failed to parse Claude response: Invalid JSON');
      case 'empty_response':
        return '';
      default:
        throw new Error('Unknown error occurred');
    }
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Factory functions for common test scenarios

export function createMockContentGenerator(config = {}) {
  const generator = new MockContentGenerator();

  if (config.shouldFail) {
    generator.setFailure(true, config.failureType);
  }

  if (config.customResponse) {
    generator.setCustomResponse(config.customResponse);
  }

  if (config.responseDelay) {
    generator.setResponseDelay(config.responseDelay);
  }

  return generator;
}

export function createFailingContentGenerator(failureType = 'api_error') {
  return createMockContentGenerator({ shouldFail: true, failureType });
}

export default MockContentGenerator;
