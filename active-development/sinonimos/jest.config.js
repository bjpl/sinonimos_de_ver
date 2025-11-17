/** @type {import('jest').Config} */
export default {
  // Test environment
  testEnvironment: 'node',

  // Enable ES modules support (package.json has "type": "module")
  transform: {},

  // Module name mapper for absolute imports
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },

  // Test match patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],

  // Ignore example tests and duplicate generator directory
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/examples/',
    '/generator/generator/'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    'generator/src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!**/node_modules/**'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Coverage directory
  coverageDirectory: 'coverage',

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],

  // Module paths
  modulePaths: ['<rootDir>'],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Reset mocks between tests
  resetMocks: true
};
