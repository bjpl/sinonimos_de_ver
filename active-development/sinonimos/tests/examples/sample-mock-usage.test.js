/**
 * Sample Test Demonstrating Mock Usage
 * This file shows how to use all the mock utilities and test helpers
 */

import {
  MockUnsplashService,
  createMockUnsplashService,
  createFailingUnsplashService
} from '../mocks/unsplash.mock.js';

import {
  MockContentGenerator,
  createMockContentGenerator,
  createFailingContentGenerator
} from '../mocks/anthropic.mock.js';

import {
  MockAudioGenerator,
  createMockAudioGenerator,
  createFailingAudioGenerator
} from '../mocks/edge-tts.mock.js';

import {
  MockFileSystem,
  createMockFileSystem
} from '../mocks/filesystem.mock.js';

import {
  createTestEnvironment,
  resetTestEnvironment,
  assertValidSynonym,
  assertThrows,
  measureExecutionTime
} from '../helpers/testHelpers.js';

import {
  mockSynonym,
  mockLiterarySynonym,
  createSynonymSet,
  errorScenarios
} from '../helpers/fixtures.js';

// === Example 1: Basic Unsplash Mock Usage ===

async function testUnsplashBasic() {
  console.log('\n=== Test: Unsplash Basic Usage ===');

  const unsplash = new MockUnsplashService('test-key');

  // Search for photos
  const photos = await unsplash.searchPhotos('eating dining meal', { perPage: 3 });
  console.log(`✓ Found ${photos.length} photos`);

  // Download image
  const metadata = await unsplash.downloadImage(
    'eating',
    '/test/output/eating.jpg',
    ['dining', 'meal']
  );
  console.log(`✓ Downloaded: ${metadata.filename}`);
  console.log(`  Photographer: ${metadata.photographer}`);

  // Check statistics
  const stats = unsplash.getStats();
  console.log(`✓ Stats: ${stats.totalCalls} API calls, ${stats.searches} searches`);
}

// === Example 2: Unsplash Error Scenarios ===

async function testUnsplashErrors() {
  console.log('\n=== Test: Unsplash Error Scenarios ===');

  // Test rate limit error
  const rateLimited = createFailingUnsplashService('rate_limit');
  try {
    await rateLimited.searchPhotos('test');
    console.log('✗ Should have thrown error');
  } catch (error) {
    console.log(`✓ Rate limit error caught: ${error.message}`);
  }

  // Test no results
  const noResults = createFailingUnsplashService('no_results');
  try {
    await noResults.searchPhotos('nonexistent');
    console.log('✗ Should have thrown error');
  } catch (error) {
    console.log(`✓ No results error caught: ${error.message}`);
  }

  // Test network error
  const networkError = createFailingUnsplashService('network');
  try {
    await networkError.searchPhotos('test');
    console.log('✗ Should have thrown error');
  } catch (error) {
    console.log(`✓ Network error caught: ${error.message}`);
  }
}

// === Example 3: Content Generator Mock Usage ===

async function testContentGenerator() {
  console.log('\n=== Test: Content Generator Usage ===');

  const generator = new MockContentGenerator();

  // Generate synonyms
  const synonyms = await generator.generateSynonyms('ver', 5);
  console.log(`✓ Generated ${synonyms.length} synonyms`);

  // Check that literary synonyms have narratives
  const literaryCount = synonyms.filter(s =>
    s.context === 'literario' && s.narrativeExperience
  ).length;
  console.log(`✓ Found ${literaryCount} literary synonyms with narratives`);

  // Test enhance synonym
  const enhanced = await generator.enhanceSynonym(mockSynonym);
  console.log(`✓ Enhanced synonym: ${enhanced.verb}`);

  // Check stats
  const stats = generator.getStats();
  console.log(`✓ Stats: ${stats.totalCalls} API calls`);
}

// === Example 4: Audio Generator Mock Usage ===

async function testAudioGenerator() {
  console.log('\n=== Test: Audio Generator Usage ===');

  const audio = new MockAudioGenerator();

  // Check installation
  const isInstalled = await audio.checkInstallation();
  console.log(`✓ Edge TTS installed: ${isInstalled}`);

  // Generate single audio
  const result = await audio.generateAudio(
    'observar',
    '/test/output/audio/observar.mp3',
    'mx_female_1'
  );
  console.log(`✓ Generated audio: ${result.file}`);
  console.log(`  Voice: ${result.voiceName}`);

  // Generate all audio for synonym set
  const synonyms = createSynonymSet(3, { literaryCount: 2 });
  const metadata = await audio.generateAll(synonyms, '/test/output');
  console.log(`✓ Generated audio for ${Object.keys(metadata.verbs).length} verbs`);

  // Check stats
  const stats = audio.getStats();
  console.log(`✓ Stats: ${stats.audioGenerated} files generated`);
  console.log(`  Voice usage:`, stats.voiceUsage);
}

// === Example 5: File System Mock Usage ===

async function testFileSystem() {
  console.log('\n=== Test: File System Usage ===');

  const fs = createMockFileSystem({
    seed: {
      files: {
        '/test/existing.txt': 'existing content'
      },
      directories: ['/test', '/test/subdir']
    }
  });

  // Create directory
  await fs.mkdir('/test/newdir', { recursive: true });
  console.log('✓ Created directory');

  // Write file
  await fs.writeFile('/test/newdir/test.txt', 'test content');
  console.log('✓ Wrote file');

  // Read file
  const content = await fs.readFile('/test/newdir/test.txt', 'utf8');
  console.log(`✓ Read file: "${content}"`);

  // List directory
  const files = await fs.readdir('/test');
  console.log(`✓ Directory contains: ${files.join(', ')}`);

  // Check stats
  const stats = fs.getStats();
  console.log(`✓ Stats: ${stats.totalOperations} operations`);
  console.log(`  Files: ${stats.fileCount}, Directories: ${stats.directoryCount}`);
}

// === Example 6: Complete Test Environment ===

async function testCompleteEnvironment() {
  console.log('\n=== Test: Complete Test Environment ===');

  const env = createTestEnvironment({
    unsplashKey: 'test-key',
    seedFiles: {
      files: {
        '/output/existing.json': JSON.stringify(mockSynonym)
      },
      directories: ['/output']
    }
  });

  // Test unsplash
  const photos = await env.unsplash.searchPhotos('testing');
  console.log(`✓ Unsplash: Found ${photos.length} photos`);

  // Test content generation
  const synonyms = await env.contentGenerator.generateSynonyms('test', 3);
  console.log(`✓ Content: Generated ${synonyms.length} synonyms`);

  // Test audio
  await env.audioGenerator.generateAudio('test', '/output/test.mp3');
  console.log('✓ Audio: Generated test audio');

  // Test file system
  await env.fileSystem.writeFile('/output/test.json', JSON.stringify(synonyms));
  const exists = await env.fileSystem.exists('/output/test.json');
  console.log(`✓ FileSystem: File exists: ${exists}`);

  // Get combined stats
  const stats = await measureExecutionTime(async () => {
    return {
      unsplash: env.unsplash.getStats(),
      content: env.contentGenerator.getStats(),
      audio: env.audioGenerator.getStats(),
      fs: env.fileSystem.getStats()
    };
  });

  console.log(`✓ Retrieved stats in ${stats.duration}ms`);
  console.log('  Total operations:',
    stats.result.unsplash.totalCalls +
    stats.result.content.totalCalls +
    stats.result.audio.totalCalls +
    stats.result.fs.totalOperations
  );

  // Reset environment
  resetTestEnvironment(env);
  console.log('✓ Environment reset complete');
}

// === Example 7: Error Testing with Helpers ===

async function testErrorHelpers() {
  console.log('\n=== Test: Error Testing Helpers ===');

  const failingUnsplash = createFailingUnsplashService('auth');

  // Test assertThrows
  const error = await assertThrows(
    () => failingUnsplash.searchPhotos('test'),
    'Invalid access token'
  );
  console.log(`✓ assertThrows worked: ${error.message}`);

  // Test with content generator
  const failingContent = createFailingContentGenerator('rate_limit');
  const contentError = await assertThrows(
    () => failingContent.generateSynonyms('test'),
    'Rate limit'
  );
  console.log(`✓ Content error caught: ${contentError.message}`);
}

// === Example 8: Synonym Validation ===

async function testSynonymValidation() {
  console.log('\n=== Test: Synonym Validation ===');

  // Validate basic synonym
  try {
    assertValidSynonym(mockSynonym);
    console.log('✓ Basic synonym is valid');
  } catch (error) {
    console.log(`✗ Validation failed: ${error.message}`);
  }

  // Validate literary synonym
  try {
    assertValidSynonym(mockLiterarySynonym);
    console.log('✓ Literary synonym is valid');
  } catch (error) {
    console.log(`✗ Validation failed: ${error.message}`);
  }

  // Test invalid synonym (missing field)
  const invalidSynonym = { ...mockSynonym };
  delete invalidSynonym.examples;

  try {
    assertValidSynonym(invalidSynonym);
    console.log('✗ Should have failed validation');
  } catch (error) {
    console.log(`✓ Invalid synonym caught: ${error.message}`);
  }
}

// === Run All Tests ===

async function runAllTests() {
  console.log('========================================');
  console.log('  MOCK UTILITIES DEMONSTRATION');
  console.log('========================================');

  try {
    await testUnsplashBasic();
    await testUnsplashErrors();
    await testContentGenerator();
    await testAudioGenerator();
    await testFileSystem();
    await testCompleteEnvironment();
    await testErrorHelpers();
    await testSynonymValidation();

    console.log('\n========================================');
    console.log('  ALL TESTS PASSED ✓');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export {
  testUnsplashBasic,
  testUnsplashErrors,
  testContentGenerator,
  testAudioGenerator,
  testFileSystem,
  testCompleteEnvironment,
  testErrorHelpers,
  testSynonymValidation
};
