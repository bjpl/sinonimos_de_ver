/**
 * ContentGenerator Service Tests
 * Comprehensive test suite covering AI integration, error handling, and response parsing
 */

import { jest, describe, it, beforeEach, afterEach, expect } from '@jest/globals';
import https from 'https';
import { EventEmitter } from 'events';

// Mock the https module
const mockRequest = jest.fn();
jest.unstable_mockModule('https', () => ({
  default: {
    request: mockRequest
  }
}));

// Import after mocking
const { ContentGenerator } = await import('../../src/services/ContentGenerator.js');

describe('ContentGenerator', () => {
  let generator;
  let mockResponse;
  let originalEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };

    // Set test API key
    process.env.ANTHROPIC_API_KEY = 'test-api-key-12345';

    // Create fresh generator instance
    generator = new ContentGenerator();

    // Create mock response object
    mockResponse = new EventEmitter();
    mockResponse.statusCode = 200;

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Constructor', () => {
    it('should initialize with API key from environment', () => {
      expect(generator.apiKey).toBe('test-api-key-12345');
    });

    it('should set correct Claude model', () => {
      expect(generator.model).toBe('claude-sonnet-4-20250514');
    });

    it('should handle missing API key gracefully', () => {
      delete process.env.ANTHROPIC_API_KEY;
      const gen = new ContentGenerator();
      expect(gen.apiKey).toBeUndefined();
    });
  });

  describe('buildPrompt', () => {
    it('should generate prompt with correct verb and count', () => {
      const prompt = generator.buildPrompt('ver', 10);

      expect(prompt).toContain('ver');
      expect(prompt).toContain('10');
      expect(prompt).toContain('Spanish synonyms');
    });

    it('should request all required fields', () => {
      const prompt = generator.buildPrompt('ver', 5);

      const requiredFields = [
        'verb',
        'pronunciation',
        'quickDefinition',
        'definition',
        'formality',
        'context',
        'regions',
        'examples',
        'culturalNotes'
      ];

      requiredFields.forEach(field => {
        expect(prompt).toContain(field);
      });
    });

    it('should require literary context for at least 2 synonyms', () => {
      const prompt = generator.buildPrompt('ver', 10);

      expect(prompt).toContain('At least 2 synonyms MUST have context: "literario"');
      expect(prompt).toContain('narrativeExperience');
    });

    it('should specify narrativeExperience structure', () => {
      const prompt = generator.buildPrompt('ver', 5);

      expect(prompt).toContain('title');
      expect(prompt).toContain('parts');
      expect(prompt).toContain('literaryNote');
    });

    it('should request Latin American Spanish focus', () => {
      const prompt = generator.buildPrompt('ver', 10);

      expect(prompt).toContain('Latin American Spanish');
    });

    it('should request JSON-only output', () => {
      const prompt = generator.buildPrompt('ver', 10);

      expect(prompt).toContain('Return ONLY the JSON array');
    });
  });

  describe('callClaude', () => {
    let mockReq;

    beforeEach(() => {
      mockReq = new EventEmitter();
      mockReq.write = jest.fn();
      mockReq.end = jest.fn();

      mockRequest.mockReturnValue(mockReq);
    });

    it('should make HTTPS request with correct options', async () => {
      const prompt = 'Generate synonyms for ver';

      // Trigger successful response
      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: '["test"]' }]
        }));
        mockResponse.emit('end');
      });

      await generator.callClaude(prompt);

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          hostname: 'api.anthropic.com',
          path: '/v1/messages',
          method: 'POST'
        }),
        expect.any(Function)
      );
    });

    it('should include API key in headers', async () => {
      const prompt = 'Generate synonyms';

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: '[]' }]
        }));
        mockResponse.emit('end');
      });

      await generator.callClaude(prompt);

      const headers = mockRequest.mock.calls[0][0].headers;
      expect(headers['x-api-key']).toBe('test-api-key-12345');
    });

    it('should set correct anthropic-version header', async () => {
      const prompt = 'Generate synonyms';

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: '[]' }]
        }));
        mockResponse.emit('end');
      });

      await generator.callClaude(prompt);

      const headers = mockRequest.mock.calls[0][0].headers;
      expect(headers['anthropic-version']).toBe('2023-06-01');
    });

    it('should send correct request body', async () => {
      const prompt = 'Test prompt';

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: '[]' }]
        }));
        mockResponse.emit('end');
      });

      await generator.callClaude(prompt);

      expect(mockReq.write).toHaveBeenCalledWith(
        expect.stringContaining('"model":"claude-sonnet-4-20250514"')
      );
      expect(mockReq.write).toHaveBeenCalledWith(
        expect.stringContaining('Test prompt')
      );
    });

    it('should return text content from successful response', async () => {
      const expectedText = '["synonym1", "synonym2"]';

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: expectedText }]
        }));
        mockResponse.emit('end');
      });

      const result = await generator.callClaude('Test prompt');
      expect(result).toBe(expectedText);
    });

    it('should handle non-200 status codes', async () => {
      mockResponse.statusCode = 429;

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          error: { message: 'Rate limit exceeded' }
        }));
        mockResponse.emit('end');
      });

      await expect(generator.callClaude('Test prompt'))
        .rejects.toThrow('Rate limit exceeded');
    });

    it('should handle API error without message', async () => {
      mockResponse.statusCode = 500;

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({}));
        mockResponse.emit('end');
      });

      await expect(generator.callClaude('Test prompt'))
        .rejects.toThrow('Unknown error');
    });

    it('should handle malformed JSON response', async () => {
      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', 'not valid json');
        mockResponse.emit('end');
      });

      await expect(generator.callClaude('Test prompt'))
        .rejects.toThrow('Failed to parse Claude response');
    });

    it('should handle network errors', async () => {
      setImmediate(() => {
        mockReq.emit('error', new Error('Network timeout'));
      });

      await expect(generator.callClaude('Test prompt'))
        .rejects.toThrow('Request failed: Network timeout');
    });

    it('should handle chunked responses', async () => {
      const chunk1 = '{"content":[{"te';
      const chunk2 = 'xt":"test"}]}';

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', chunk1);
        mockResponse.emit('data', chunk2);
        mockResponse.emit('end');
      });

      const result = await generator.callClaude('Test prompt');
      expect(result).toBe('test');
    });
  });

  describe('parseSynonymResponse', () => {
    it('should parse plain JSON array', () => {
      const response = JSON.stringify([
        { verb: 'observar', pronunciation: 'ob-ser-var' }
      ]);

      const result = generator.parseSynonymResponse(response);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0].verb).toBe('observar');
    });

    it('should extract JSON from markdown code blocks', () => {
      const response = '```json\n[{"verb": "mirar"}]\n```';

      const result = generator.parseSynonymResponse(response);

      expect(result[0].verb).toBe('mirar');
    });

    it('should handle JSON without markdown wrapper', () => {
      const response = '[{"verb": "contemplar"}]';

      const result = generator.parseSynonymResponse(response);

      expect(result[0].verb).toBe('contemplar');
    });

    it('should add image placeholder paths', () => {
      const response = JSON.stringify([
        { verb: 'observar' },
        { verb: 'mirar' }
      ]);

      const result = generator.parseSynonymResponse(response);

      expect(result[0].image).toBe('assets/images/synonyms/observar.jpg');
      expect(result[1].image).toBe('assets/images/synonyms/mirar.jpg');
    });

    it('should preserve existing image paths', () => {
      const response = JSON.stringify([
        { verb: 'ver', image: 'custom/path.jpg' }
      ]);

      const result = generator.parseSynonymResponse(response);

      expect(result[0].image).toBe('custom/path.jpg');
    });

    it('should throw error for non-array response', () => {
      const response = JSON.stringify({ verb: 'ver' });

      expect(() => generator.parseSynonymResponse(response))
        .toThrow('Failed to parse synonym data');
    });

    it('should throw error when no JSON found', () => {
      const response = 'This is just text without JSON';

      expect(() => generator.parseSynonymResponse(response))
        .toThrow('No JSON found in response');
    });

    it('should throw error for malformed JSON', () => {
      const response = '[{verb: "invalid json"}]';

      expect(() => generator.parseSynonymResponse(response))
        .toThrow('Failed to parse synonym data');
    });

    it('should handle complex nested JSON', () => {
      const response = JSON.stringify([
        {
          verb: 'observar',
          narrativeExperience: {
            title: 'Test',
            parts: ['Part 1', 'Part 2'],
            literaryNote: 'Note'
          }
        }
      ]);

      const result = generator.parseSynonymResponse(response);

      expect(result[0].narrativeExperience).toBeDefined();
      expect(result[0].narrativeExperience.parts).toHaveLength(2);
    });
  });

  describe('generateSynonyms', () => {
    let mockReq;

    beforeEach(() => {
      mockReq = new EventEmitter();
      mockReq.write = jest.fn();
      mockReq.end = jest.fn();
      mockRequest.mockReturnValue(mockReq);
    });

    it('should throw error when API key is missing', async () => {
      delete process.env.ANTHROPIC_API_KEY;
      const gen = new ContentGenerator();

      await expect(gen.generateSynonyms('ver'))
        .rejects.toThrow('ANTHROPIC_API_KEY environment variable is not set');
    });

    it('should generate synonyms successfully', async () => {
      const mockSynonyms = [
        { verb: 'observar', pronunciation: 'ob-ser-var' },
        { verb: 'mirar', pronunciation: 'mi-rar' }
      ];

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: JSON.stringify(mockSynonyms) }]
        }));
        mockResponse.emit('end');
      });

      const result = await generator.generateSynonyms('ver', 2);

      expect(result).toHaveLength(2);
      expect(result[0].verb).toBe('observar');
      expect(result[1].verb).toBe('mirar');
    });

    it('should use default count of 10', async () => {
      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: '[]' }]
        }));
        mockResponse.emit('end');
      });

      await generator.generateSynonyms('ver');

      // Verify the prompt includes count of 10
      const requestBody = mockReq.write.mock.calls[0][0];
      expect(requestBody).toContain('10');
    });

    it('should handle API errors', async () => {
      mockResponse.statusCode = 500;

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          error: { message: 'Server error' }
        }));
        mockResponse.emit('end');
      });

      await expect(generator.generateSynonyms('ver'))
        .rejects.toThrow('Failed to generate synonyms');
    });

    it('should handle parsing errors', async () => {
      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: 'invalid json' }]
        }));
        mockResponse.emit('end');
      });

      await expect(generator.generateSynonyms('ver'))
        .rejects.toThrow('Failed to generate synonyms');
    });

    it('should add image paths to generated synonyms', async () => {
      const mockSynonyms = [
        { verb: 'contemplar' }
      ];

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: JSON.stringify(mockSynonyms) }]
        }));
        mockResponse.emit('end');
      });

      const result = await generator.generateSynonyms('ver', 1);

      expect(result[0].image).toBeDefined();
      expect(result[0].image).toContain('contemplar.jpg');
    });
  });

  describe('enhanceSynonym', () => {
    let mockReq;

    beforeEach(() => {
      mockReq = new EventEmitter();
      mockReq.write = jest.fn();
      mockReq.end = jest.fn();
      mockRequest.mockReturnValue(mockReq);
    });

    it('should enhance synonym with narrative content', async () => {
      const inputSynonym = {
        verb: 'observar',
        definition: 'To watch carefully'
      };

      const enhancedSynonym = {
        ...inputSynonym,
        narrativeExperience: {
          title: 'La Observación',
          parts: ['Part 1', 'Part 2', 'Part 3'],
          literaryNote: 'Literary analysis'
        }
      };

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: JSON.stringify([enhancedSynonym]) }]
        }));
        mockResponse.emit('end');
      });

      const result = await generator.enhanceSynonym(inputSynonym);

      expect(result.narrativeExperience).toBeDefined();
      expect(result.narrativeExperience.parts).toHaveLength(3);
    });

    it('should include original synonym data in prompt', async () => {
      const inputSynonym = {
        verb: 'mirar',
        definition: 'To look at'
      };

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: JSON.stringify([inputSynonym]) }]
        }));
        mockResponse.emit('end');
      });

      await generator.enhanceSynonym(inputSynonym);

      const requestBody = mockReq.write.mock.calls[0][0];
      expect(requestBody).toContain('mirar');
      expect(requestBody).toContain('To look at');
    });

    it('should request cultural context enhancement', async () => {
      const inputSynonym = { verb: 'ver' };

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: JSON.stringify([inputSynonym]) }]
        }));
        mockResponse.emit('end');
      });

      await generator.enhanceSynonym(inputSynonym);

      const requestBody = mockReq.write.mock.calls[0][0];
      expect(requestBody).toContain('Cultural context');
      expect(requestBody).toContain('Latin America');
    });

    it('should return only the first enhanced synonym', async () => {
      const enhancedSynonyms = [
        { verb: 'observar', enhanced: true },
        { verb: 'mirar', enhanced: true }
      ];

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: JSON.stringify(enhancedSynonyms) }]
        }));
        mockResponse.emit('end');
      });

      const result = await generator.enhanceSynonym({ verb: 'ver' });

      expect(result.verb).toBe('observar');
      expect(result.enhanced).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    let mockReq;

    beforeEach(() => {
      mockReq = new EventEmitter();
      mockReq.write = jest.fn();
      mockReq.end = jest.fn();
      mockRequest.mockReturnValue(mockReq);
    });

    it('should handle complete workflow from prompt to parsed synonyms', async () => {
      const mockSynonyms = [
        {
          verb: 'observar',
          pronunciation: 'ob-ser-var',
          quickDefinition: 'To watch carefully',
          definition: 'To observe with attention',
          formality: 'neutral',
          context: 'literario',
          regions: ['general'],
          examples: ['Example 1', 'Example 2', 'Example 3'],
          culturalNotes: 'Used in literature',
          narrativeExperience: {
            title: 'La Observación',
            parts: ['Part 1', 'Part 2', 'Part 3'],
            literaryNote: 'Common in poetry'
          }
        }
      ];

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          content: [{ text: JSON.stringify(mockSynonyms) }]
        }));
        mockResponse.emit('end');
      });

      const result = await generator.generateSynonyms('ver', 1);

      // Verify all required fields are present
      expect(result[0]).toMatchObject({
        verb: expect.any(String),
        pronunciation: expect.any(String),
        quickDefinition: expect.any(String),
        definition: expect.any(String),
        formality: expect.any(String),
        context: expect.any(String),
        regions: expect.any(Array),
        examples: expect.any(Array),
        culturalNotes: expect.any(String),
        image: expect.any(String),
        narrativeExperience: expect.objectContaining({
          title: expect.any(String),
          parts: expect.any(Array),
          literaryNote: expect.any(String)
        })
      });
    });

    it('should handle rate limiting with proper error message', async () => {
      mockResponse.statusCode = 429;

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          error: {
            type: 'rate_limit_error',
            message: 'Rate limit exceeded. Please try again later.'
          }
        }));
        mockResponse.emit('end');
      });

      await expect(generator.generateSynonyms('ver'))
        .rejects.toThrow('Rate limit exceeded');
    });

    it('should handle authentication errors', async () => {
      mockResponse.statusCode = 401;

      setImmediate(() => {
        mockRequest.mock.calls[0][1](mockResponse);
        mockResponse.emit('data', JSON.stringify({
          error: {
            type: 'authentication_error',
            message: 'Invalid API key'
          }
        }));
        mockResponse.emit('end');
      });

      await expect(generator.generateSynonyms('ver'))
        .rejects.toThrow('Invalid API key');
    });
  });
});
