import { describe, it, expect } from 'vitest';
import { sanitizeHtml, validateHtml } from './previewHtml';

describe('sanitizeHtml', () => {
  it('preserves a normal document structure', () => {
    const result = sanitizeHtml('<html><body><h1>Hi</h1></body></html>');
    expect(result.success).toBe(true);
    expect(result.result).toContain('<h1>Hi</h1>');
  });

  it('strips dangerous protocols from links', () => {
    const result = sanitizeHtml('<a href="javascript:alert(1)">click</a>');
    expect(result.success).toBe(true);
    expect(result.result).not.toContain('javascript:');
  });

  it('rejects empty input', () => {
    const result = sanitizeHtml('   ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Input is empty');
  });
});

describe('validateHtml', () => {
  it('accepts well-formed HTML', () => {
    expect(validateHtml('<div>hello</div>')).toEqual({ valid: true });
  });
});
