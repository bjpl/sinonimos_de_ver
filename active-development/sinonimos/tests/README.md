# Test Utilities Documentation

Comprehensive mock utilities and test helpers for the Sinonimos generator project.

## 📁 Directory Structure

```
tests/
├── mocks/
│   ├── unsplash.mock.js      # Mock Unsplash API
│   ├── anthropic.mock.js     # Mock Claude AI
│   ├── edge-tts.mock.js      # Mock Python TTS
│   └── filesystem.mock.js    # Mock file system
├── helpers/
│   ├── fixtures.js           # Test data fixtures
│   └── testHelpers.js        # Common test utilities
└── examples/
    └── sample-mock-usage.test.js  # Usage examples
```

## 🎯 Mock Services

### Unsplash Mock (`unsplash.mock.js`)

Simulates Unsplash API for image search and download testing.

**Features:**
- Photo search with realistic mock data
- Image download simulation
- Fallback query handling
- Smart query building
- Error scenario simulation

**Usage:**

```javascript
import { MockUnsplashService, createMockUnsplashService } from './mocks/unsplash.mock.js';

// Basic usage
const unsplash = new MockUnsplashService('test-key');
const photos = await unsplash.searchPhotos('eating dining');
const metadata = await unsplash.downloadImage('eating', '/output/eating.jpg');

// Error scenarios
const failingService = createMockUnsplashService({
  shouldFail: true,
  failureType: 'rate_limit'
});
```

**Error Types:**
- `search` - General search failure
- `no_results` - Empty results
- `auth` - Invalid access token
- `network` - Network error
- `timeout` - Request timeout
- `download` - Download failure

### Anthropic Mock (`anthropic.mock.js`)

Simulates Claude AI API for content generation testing.

**Features:**
- Synonym generation with realistic data
- Literary synonyms with narratives
- Custom response configuration
- Error scenario simulation
- Response delay simulation

**Usage:**

```javascript
import { MockContentGenerator, createFailingContentGenerator } from './mocks/anthropic.mock.js';

// Basic usage
const generator = new MockContentGenerator();
const synonyms = await generator.generateSynonyms('ver', 10);

// Custom response
generator.setCustomResponse(customSynonymArray);
const result = await generator.generateSynonyms('mirar', 5);

// Error scenarios
const failing = createFailingContentGenerator('rate_limit');
```

**Error Types:**
- `api_error` - Authentication failed
- `rate_limit` - Rate limit exceeded
- `network` - Network error
- `timeout` - Request timeout
- `invalid_json` - JSON parsing error
- `empty_response` - Empty response

### Audio Mock (`edge-tts.mock.js`)

Simulates Python edge-tts execution for audio generation testing.

**Features:**
- Voice rotation across multiple LATAM voices
- Batch audio generation
- Installation checking
- Error scenario simulation
- Audio metadata tracking

**Usage:**

```javascript
import { MockAudioGenerator, createMockAudioGenerator } from './mocks/edge-tts.mock.js';

// Basic usage
const audio = new MockAudioGenerator();
await audio.generateAudio('observar', '/output/observar.mp3', 'mx_female_1');

// Batch generation
const synonyms = [/* synonym data */];
const metadata = await audio.generateAll(synonyms, '/output');

// Configure failure
audio.setFailure(true, 'python');
```

**Error Types:**
- `generation` - Command execution failed
- `python` - Python not installed
- `voice` - Invalid voice
- `install` - Installation failed
- `timeout` - Generation timeout

### File System Mock (`filesystem.mock.js`)

In-memory file system for testing without disk I/O.

**Features:**
- Full file system operations in memory
- Directory creation with recursive option
- File read/write/delete
- Stream support
- Error scenario simulation
- Seeding with initial data

**Usage:**

```javascript
import { MockFileSystem, createMockFileSystem } from './mocks/filesystem.mock.js';

// Basic usage
const fs = new MockFileSystem();
await fs.mkdir('/test/dir', { recursive: true });
await fs.writeFile('/test/file.txt', 'content');
const content = await fs.readFile('/test/file.txt', 'utf8');

// Seed with data
const seeded = createMockFileSystem({
  seed: {
    files: { '/existing.txt': 'content' },
    directories: ['/existing/dir']
  }
});

// Configure failure
fs.setFailure(true, 'permission', '/restricted/path');
```

**Error Types:**
- `permission` - Permission denied
- `disk_full` - No space left
- `readonly` - Read-only file system
- `not_found` - File/directory not found

## 🧪 Test Helpers

### Fixtures (`fixtures.js`)

Pre-built test data for consistent testing.

**Available Fixtures:**
- `mockSynonym` - Basic synonym data
- `mockLiterarySynonym` - Literary synonym with narrative
- `mockSynonymSet` - Array of varied synonyms
- `mockUnsplashPhoto` - Unsplash photo data
- `mockImageMetadata` - Image download metadata
- `mockAudioMetadata` - Audio generation metadata
- `errorScenarios` - Comprehensive error data

**Factory Functions:**

```javascript
import {
  createSynonym,
  createLiterarySynonym,
  createSynonymSet,
  createUnsplashPhoto
} from './helpers/fixtures.js';

// Create custom synonym
const synonym = createSynonym({ verb: 'custom', formality: 'formal' });

// Create synonym set with specific count
const synonyms = createSynonymSet(10, { literaryCount: 3 });

// Create photo with overrides
const photo = createUnsplashPhoto({ width: 5000, height: 4000 });
```

### Test Helpers (`testHelpers.js`)

Common utilities for test setup and assertions.

**Environment Management:**

```javascript
import { createTestEnvironment, resetTestEnvironment } from './helpers/testHelpers.js';

// Create complete test environment
const env = createTestEnvironment({
  unsplashKey: 'test-key',
  seedFiles: { files: {}, directories: [] }
});

// Use all services
await env.unsplash.searchPhotos('test');
await env.contentGenerator.generateSynonyms('test');
await env.audioGenerator.generateAudio('test', '/output/test.mp3');
await env.fileSystem.writeFile('/test.txt', 'content');

// Reset all mocks
resetTestEnvironment(env);
```

**Assertion Helpers:**

```javascript
import {
  assertValidSynonym,
  assertHasNarrative,
  assertValidImageMetadata
} from './helpers/testHelpers.js';

// Validate synonym structure
assertValidSynonym(synonym);

// Check for narrative in literary synonym
assertHasNarrative(literarySynonym);

// Validate image metadata
assertValidImageMetadata(metadata);
```

**Error Testing:**

```javascript
import { assertThrows, assertDoesNotThrow } from './helpers/testHelpers.js';

// Assert function throws
const error = await assertThrows(
  () => failingService.searchPhotos('test'),
  'Expected error message'
);

// Assert function succeeds
await assertDoesNotThrow(() => service.searchPhotos('test'));
```

**Performance Testing:**

```javascript
import { measureExecutionTime, benchmarkFunction } from './helpers/testHelpers.js';

// Measure single execution
const { result, duration } = await measureExecutionTime(async () => {
  return await expensiveOperation();
});

// Benchmark with multiple iterations
const stats = await benchmarkFunction(async () => {
  return await operation();
}, 100);

console.log(`Average: ${stats.average}ms`);
```

## 📝 Example Usage

See `tests/examples/sample-mock-usage.test.js` for complete examples of:

1. Basic Unsplash mock usage
2. Error scenario testing
3. Content generation
4. Audio generation
5. File system operations
6. Complete test environment
7. Error testing with helpers
8. Synonym validation

**Run the example:**

```bash
node tests/examples/sample-mock-usage.test.js
```

## 🎯 Best Practices

### 1. Always Reset Mocks Between Tests

```javascript
beforeEach(() => {
  mock.reset();
});
```

### 2. Use Factory Functions for Clarity

```javascript
// Good
const failingService = createFailingUnsplashService('rate_limit');

// Less clear
const service = new MockUnsplashService();
service.setFailure(true, 'rate_limit');
```

### 3. Test Both Success and Error Scenarios

```javascript
describe('Image Download', () => {
  it('should download successfully', async () => {
    const metadata = await unsplash.downloadImage('test', '/output/test.jpg');
    expect(metadata.filename).toBe('test.jpg');
  });

  it('should handle rate limit errors', async () => {
    const failing = createFailingUnsplashService('rate_limit');
    await assertThrows(() => failing.downloadImage('test', '/output/test.jpg'));
  });
});
```

### 4. Use Test Environment for Integration Tests

```javascript
const env = createTestEnvironment();

// Test complete workflow
const synonyms = await env.contentGenerator.generateSynonyms('ver', 5);
await env.fileSystem.writeFile('/synonyms.json', JSON.stringify(synonyms));
const content = await env.fileSystem.readFile('/synonyms.json', 'utf8');

resetTestEnvironment(env);
```

### 5. Leverage Statistics for Verification

```javascript
const stats = unsplash.getStats();
expect(stats.totalCalls).toBe(3);
expect(stats.uniqueQueries).toBe(2);
```

## 🔧 Configuration Options

### Mock Configuration

All mocks support configuration via constructor or factory functions:

```javascript
const mock = createMockUnsplashService({
  accessKey: 'custom-key',
  shouldFail: false,
  failureType: null,
  downloadDelay: 100
});
```

### File System Seeding

```javascript
const fs = createMockFileSystem({
  seed: {
    files: {
      '/path/to/file.txt': 'content',
      '/data.json': JSON.stringify({ key: 'value' })
    },
    directories: [
      '/path/to',
      '/other/dir'
    ]
  }
});
```

## 📊 Statistics and Debugging

All mocks provide `getStats()` method:

```javascript
const stats = mock.getStats();
console.log(JSON.stringify(stats, null, 2));
```

**Unsplash Stats:**
- Total API calls
- Number of searches
- Unique queries
- Search history

**Content Generator Stats:**
- Total API calls
- Call history
- Average synonym count

**Audio Generator Stats:**
- Total calls
- Audio files generated
- Voice usage distribution
- Unique texts

**File System Stats:**
- Total operations
- File count
- Directory count
- Operations by type
- Operation history

## 🚀 Next Steps

1. Write unit tests for Generator class
2. Write integration tests for complete workflows
3. Add performance benchmarks
4. Set up continuous integration
5. Add coverage reporting

## 📄 License

Same as parent project.
