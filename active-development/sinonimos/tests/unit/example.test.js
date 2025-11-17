/**
 * Example Unit Test
 * Demonstrates basic Jest testing patterns
 */

describe('Example Test Suite', () => {
  test('should pass basic assertion', () => {
    expect(true).toBe(true);
  });

  test('should perform arithmetic correctly', () => {
    expect(2 + 2).toBe(4);
  });

  test('should handle string operations', () => {
    const str = 'hello';
    expect(str.toUpperCase()).toBe('HELLO');
  });
});
