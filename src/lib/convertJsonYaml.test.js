import { describe, it, expect } from 'vitest';
import { convertJsonToYaml, convertYamlToJson, validateYaml } from './convertJsonYaml';

describe('convertJsonToYaml', () => {
  it('converts a simple object', () => {
    const result = convertJsonToYaml('{"name":"John","age":30}');
    expect(result.success).toBe(true);
    expect(result.result).toBe('name: John\nage: 30\n');
  });

  it('rejects empty input', () => {
    const result = convertJsonToYaml('   ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Input is empty');
  });

  it('reports a parse error for malformed JSON', () => {
    const result = convertJsonToYaml('{invalid}');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/JSON Parse Error/);
  });
});

describe('convertYamlToJson', () => {
  it('converts simple YAML to formatted JSON', () => {
    const result = convertYamlToJson('name: John\nage: 30');
    expect(result.success).toBe(true);
    expect(JSON.parse(result.result)).toEqual({ name: 'John', age: 30 });
  });

  it('minifies when requested', () => {
    const result = convertYamlToJson('a: 1', { minify: true });
    expect(result.result).toBe('{"a":1}');
  });

  it('rejects empty input', () => {
    const result = convertYamlToJson('   ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Input is empty');
  });

  it('reports a parse error for malformed YAML', () => {
    const result = convertYamlToJson('key: [unclosed');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/YAML Parse Error/);
  });
});

describe('validateYaml', () => {
  it('accepts valid YAML', () => {
    expect(validateYaml('a: 1')).toEqual({ valid: true });
  });

  it('rejects invalid YAML', () => {
    const result = validateYaml('key: [unclosed');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
