import { describe, it, expect } from 'vitest';
import { formatJson, validateJson } from './formatJson';

describe('formatJson', () => {
  it('formats valid JSON with default 2-space indent', () => {
    const result = formatJson('{"b":1,"a":2}');
    expect(result.success).toBe(true);
    expect(result.result).toBe('{\n  "b": 1,\n  "a": 2\n}');
  });

  it('respects a custom indent size', () => {
    const result = formatJson('{"a":1}', { indent: 4 });
    expect(result.success).toBe(true);
    expect(result.result).toBe('{\n    "a": 1\n}');
  });

  it('minifies when requested', () => {
    const result = formatJson('{\n  "a": 1,\n  "b": 2\n}', { minify: true });
    expect(result.success).toBe(true);
    expect(result.result).toBe('{"a":1,"b":2}');
  });

  it('sorts keys alphabetically when requested', () => {
    const result = formatJson('{"b":1,"a":2}', { sortKeys: true });
    expect(result.success).toBe(true);
    expect(result.result).toBe('{\n  "a": 2,\n  "b": 1\n}');
  });

  it('sorts keys recursively in nested objects', () => {
    const result = formatJson('{"z":{"y":1,"x":2}}', { sortKeys: true, minify: true });
    expect(result.result).toBe('{"z":{"x":2,"y":1}}');
  });

  it('sorts keys inside arrays of objects', () => {
    const result = formatJson('[{"b":1,"a":2}]', { sortKeys: true, minify: true });
    expect(result.result).toBe('[{"a":2,"b":1}]');
  });

  it('rejects empty input', () => {
    const result = formatJson('   ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Input is empty');
  });

  it('reports a parse error for malformed JSON', () => {
    const result = formatJson('{"a": 1,}');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/JSON Parse Error/);
  });
});

describe('validateJson', () => {
  it('accepts valid JSON', () => {
    expect(validateJson('{"a":1}')).toEqual({ valid: true });
  });

  it('rejects invalid JSON with an error message', () => {
    const result = validateJson('{invalid}');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
