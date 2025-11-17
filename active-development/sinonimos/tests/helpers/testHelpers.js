/**
 * Common Test Utilities and Helpers
 * Reusable functions for test setup, assertions, and cleanup
 */

import { MockUnsplashService } from '../mocks/unsplash.mock.js';
import { MockContentGenerator } from '../mocks/anthropic.mock.js';
import { MockAudioGenerator } from '../mocks/edge-tts.mock.js';
import { MockFileSystem } from '../mocks/filesystem.mock.js';

// === Test Environment Setup ===

/**
 * Create a complete test environment with all mocks
 */
export function createTestEnvironment(config = {}) {
  const env = {
    unsplash: new MockUnsplashService(config.unsplashKey),
    contentGenerator: new MockContentGenerator(),
    audioGenerator: new MockAudioGenerator(),
    fileSystem: new MockFileSystem()
  };

  // Apply configuration
  if (config.unsplashFailure) {
    env.unsplash.setFailure(true, config.unsplashFailure);
  }

  if (config.contentFailure) {
    env.contentGenerator.setFailure(true, config.contentFailure);
  }

  if (config.audioFailure) {
    env.audioGenerator.setFailure(true, config.audioFailure);
  }

  if (config.filesystemFailure) {
    env.fileSystem.setFailure(true, config.filesystemFailure);
  }

  if (config.seedFiles) {
    env.fileSystem.seed(config.seedFiles);
  }

  return env;
}

/**
 * Reset all mocks in environment
 */
export function resetTestEnvironment(env) {
  env.unsplash.reset();
  env.contentGenerator.reset();
  env.audioGenerator.reset();
  env.fileSystem.reset();
}

/**
 * Get combined statistics from all mocks
 */
export function getEnvironmentStats(env) {
  return {
    unsplash: env.unsplash.getStats(),
    contentGenerator: env.contentGenerator.getStats(),
    audioGenerator: env.audioGenerator.getStats(),
    fileSystem: env.fileSystem.getStats()
  };
}

// === Assertion Helpers ===

/**
 * Assert that a synonym has all required fields
 */
export function assertValidSynonym(synonym) {
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

  for (const field of requiredFields) {
    if (!(field in synonym)) {
      throw new Error(`Synonym missing required field: ${field}`);
    }
  }

  // Validate examples is array with at least 1 item
  if (!Array.isArray(synonym.examples) || synonym.examples.length === 0) {
    throw new Error('Synonym must have at least one example');
  }

  // Validate formality level
  const validFormality = ['formal', 'neutral', 'informal'];
  if (!validFormality.includes(synonym.formality)) {
    throw new Error(`Invalid formality level: ${synonym.formality}`);
  }

  // Validate context
  const validContexts = ['cotidiano', 'literario', 'narrativo', 'profesional'];
  if (!validContexts.includes(synonym.context)) {
    throw new Error(`Invalid context: ${synonym.context}`);
  }

  return true;
}

/**
 * Assert that literary synonym has narrative experience
 */
export function assertHasNarrative(synonym) {
  if (synonym.context !== 'literario') {
    throw new Error('Only literary synonyms should have narratives');
  }

  if (!synonym.narrativeExperience) {
    throw new Error('Literary synonym missing narrativeExperience');
  }

  const narrative = synonym.narrativeExperience;

  if (!narrative.title) {
    throw new Error('Narrative missing title');
  }

  if (!Array.isArray(narrative.parts) || narrative.parts.length !== 3) {
    throw new Error('Narrative must have exactly 3 parts');
  }

  if (!narrative.literaryNote) {
    throw new Error('Narrative missing literaryNote');
  }

  return true;
}

/**
 * Assert that image metadata is valid
 */
export function assertValidImageMetadata(metadata) {
  const requiredFields = [
    'filename',
    'photographer',
    'photographerUrl',
    'unsplashUrl',
    'query',
    'attemptNumber'
  ];

  for (const field of requiredFields) {
    if (!(field in metadata)) {
      throw new Error(`Image metadata missing field: ${field}`);
    }
  }

  return true;
}

/**
 * Assert that audio metadata is valid
 */
export function assertValidAudioMetadata(metadata) {
  if (!metadata.verbs || typeof metadata.verbs !== 'object') {
    throw new Error('Audio metadata missing verbs object');
  }

  if (!metadata.voices || typeof metadata.voices !== 'object') {
    throw new Error('Audio metadata missing voices object');
  }

  if (!metadata.generatedAt) {
    throw new Error('Audio metadata missing generatedAt timestamp');
  }

  return true;
}

// === Mock Configuration Helpers ===

/**
 * Configure Unsplash mock for success scenario
 */
export function setupSuccessfulUnsplash(mock, photos = 1) {
  mock.reset();
  mock.setFailure(false);
  return mock;
}

/**
 * Configure Unsplash mock for failure scenario
 */
export function setupFailingUnsplash(mock, failureType = 'search') {
  mock.reset();
  mock.setFailure(true, failureType);
  return mock;
}

/**
 * Configure content generator for success scenario
 */
export function setupSuccessfulContentGenerator(mock, customResponse = null) {
  mock.reset();
  mock.setFailure(false);
  if (customResponse) {
    mock.setCustomResponse(customResponse);
  }
  return mock;
}

/**
 * Configure content generator for failure scenario
 */
export function setupFailingContentGenerator(mock, failureType = 'api_error') {
  mock.reset();
  mock.setFailure(true, failureType);
  return mock;
}

/**
 * Configure audio generator for success scenario
 */
export function setupSuccessfulAudioGenerator(mock) {
  mock.reset();
  mock.setFailure(false);
  mock.setInstalled(true);
  return mock;
}

/**
 * Configure audio generator for failure scenario
 */
export function setupFailingAudioGenerator(mock, failureType = 'generation') {
  mock.reset();
  mock.setFailure(true, failureType);
  return mock;
}

// === Data Validation Helpers ===

/**
 * Validate that synonym set has proper variety
 */
export function validateSynonymVariety(synonyms) {
  const contexts = new Set(synonyms.map(s => s.context));
  const formalities = new Set(synonyms.map(s => s.formality));

  return {
    hasVariety: contexts.size > 1 && formalities.size > 1,
    contexts: Array.from(contexts),
    formalities: Array.from(formalities),
    literaryCount: synonyms.filter(s => s.context === 'literario').length
  };
}

/**
 * Count literary synonyms with narratives
 */
export function countNarratives(synonyms) {
  return synonyms.filter(s =>
    s.context === 'literario' && s.narrativeExperience
  ).length;
}

/**
 * Validate regions are properly formatted
 */
export function validateRegions(regions) {
  if (!Array.isArray(regions) || regions.length === 0) {
    return { valid: false, error: 'Regions must be non-empty array' };
  }

  const validRegions = [
    'general',
    'México',
    'Centroamérica',
    'Caribe',
    'Sudamérica',
    'Cono Sur',
    'Región Andina'
  ];

  for (const region of regions) {
    if (!validRegions.includes(region)) {
      return { valid: false, error: `Invalid region: ${region}` };
    }
  }

  return { valid: true };
}

// === Performance Testing Helpers ===

/**
 * Measure execution time of async function
 */
export async function measureExecutionTime(fn) {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;

  return {
    result,
    duration,
    durationMs: duration
  };
}

/**
 * Run function multiple times and get average time
 */
export async function benchmarkFunction(fn, iterations = 10) {
  const times = [];

  for (let i = 0; i < iterations; i++) {
    const { duration } = await measureExecutionTime(fn);
    times.push(duration);
  }

  return {
    iterations,
    times,
    average: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times)
  };
}

// === Cleanup Helpers ===

/**
 * Safe cleanup function that catches errors
 */
export async function safeCleanup(cleanupFn) {
  try {
    await cleanupFn();
  } catch (error) {
    console.warn('Cleanup error:', error.message);
  }
}

/**
 * Create a cleanup stack for multiple cleanup operations
 */
export function createCleanupStack() {
  const stack = [];

  return {
    add: (fn) => stack.push(fn),
    run: async () => {
      for (const fn of stack.reverse()) {
        await safeCleanup(fn);
      }
      stack.length = 0;
    }
  };
}

// === Error Testing Helpers ===

/**
 * Assert that function throws specific error
 */
export async function assertThrows(fn, expectedMessage = null) {
  let error = null;

  try {
    await fn();
  } catch (err) {
    error = err;
  }

  if (!error) {
    throw new Error('Expected function to throw, but it did not');
  }

  if (expectedMessage && !error.message.includes(expectedMessage)) {
    throw new Error(
      `Expected error message to include "${expectedMessage}", got "${error.message}"`
    );
  }

  return error;
}

/**
 * Assert that function does not throw
 */
export async function assertDoesNotThrow(fn) {
  try {
    await fn();
  } catch (error) {
    throw new Error(`Expected function not to throw, but got: ${error.message}`);
  }
}

// === Wait/Delay Helpers ===

/**
 * Wait for condition to be true
 */
export async function waitFor(condition, timeout = 5000, interval = 100) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (await condition()) {
      return true;
    }
    await delay(interval);
  }

  throw new Error('Condition not met within timeout');
}

/**
 * Simple delay helper
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// === Export all helpers ===

export default {
  createTestEnvironment,
  resetTestEnvironment,
  getEnvironmentStats,
  assertValidSynonym,
  assertHasNarrative,
  assertValidImageMetadata,
  assertValidAudioMetadata,
  setupSuccessfulUnsplash,
  setupFailingUnsplash,
  setupSuccessfulContentGenerator,
  setupFailingContentGenerator,
  setupSuccessfulAudioGenerator,
  setupFailingAudioGenerator,
  validateSynonymVariety,
  countNarratives,
  validateRegions,
  measureExecutionTime,
  benchmarkFunction,
  safeCleanup,
  createCleanupStack,
  assertThrows,
  assertDoesNotThrow,
  waitFor,
  delay
};
