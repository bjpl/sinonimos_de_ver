# Test Mocks

This directory contains mock implementations for testing.

## Structure

- **API mocks**: Mock API responses and services
- **Data mocks**: Mock data fixtures for testing
- **Module mocks**: Mock implementations of modules and dependencies

## Usage

```javascript
// Import mock data
const mockData = require('./mocks/data/synonyms');

// Use in tests
test('should process synonyms', () => {
  const result = processSynonyms(mockData);
  expect(result).toBeDefined();
});
```
