import { describe, it, expect } from 'vitest';
import { convertMarkdownToHtml, convertHtmlToMarkdown } from './convertMarkdownHtml';

describe('convertMarkdownToHtml', () => {
  it('converts a heading and bold text', () => {
    const result = convertMarkdownToHtml('# Title\n\nThis is **bold**.');
    expect(result.success).toBe(true);
    expect(result.result).toContain('<h1>Title</h1>');
    expect(result.result).toContain('<strong>bold</strong>');
  });

  it('sanitizes dangerous script tags out of the output', () => {
    const result = convertMarkdownToHtml('<script>alert(1)</script>\n\nHello');
    expect(result.success).toBe(true);
    expect(result.result).not.toContain('<script>');
  });

  it('rejects empty input', () => {
    const result = convertMarkdownToHtml('   ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Input is empty');
  });
});

describe('convertHtmlToMarkdown', () => {
  it('converts headings, bold, and italic', () => {
    const result = convertHtmlToMarkdown('<h1>Title</h1><p>This is <strong>bold</strong> and <em>italic</em>.</p>');
    expect(result.success).toBe(true);
    expect(result.result).toContain('# Title');
    expect(result.result).toContain('**bold**');
    expect(result.result).toContain('*italic*');
  });

  it('converts links', () => {
    const result = convertHtmlToMarkdown('<a href="https://example.com">link</a>');
    expect(result.success).toBe(true);
    expect(result.result).toBe('[link](https://example.com)');
  });

  it('rejects empty input', () => {
    const result = convertHtmlToMarkdown('   ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Input is empty');
  });
});
