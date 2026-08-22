import { describe, it, expect } from 'vitest';
import { minifyHtml, calculateCompression } from './minifyHtml';

describe('minifyHtml', () => {
  it('removes HTML comments', () => {
    const result = minifyHtml('<div><!-- a comment -->text</div>');
    expect(result).not.toContain('<!--');
    expect(result).toContain('text');
  });

  it('keeps IE conditional comments intact', () => {
    const result = minifyHtml('<!--[if IE]>legacy<![endif]-->');
    expect(result).toContain('<!--[if IE]>');
  });

  it('collapses whitespace between tags', () => {
    const result = minifyHtml('<div>\n  <p>hi</p>\n</div>');
    expect(result).toBe('<div><p>hi</p></div>');
  });

  it('minifies inline style blocks', () => {
    const result = minifyHtml('<style>\n  body {\n    color: red;\n  }\n</style>');
    expect(result).toBe('<style>body{color:red}</style>');
  });
});

describe('calculateCompression', () => {
  it('reports size reduction between original and minified content', () => {
    const original = '<div>   <p>hi</p>   </div>';
    const minified = '<div><p>hi</p></div>';
    const stats = calculateCompression(original, minified);
    expect(stats.originalSize).toBeGreaterThan(stats.minifiedSize);
    expect(stats.savedBytes).toBe(stats.originalSize - stats.minifiedSize);
    expect(stats.reduction).toBeGreaterThan(0);
  });

  it('reports zero reduction for identical content', () => {
    const stats = calculateCompression('<p>hi</p>', '<p>hi</p>');
    expect(stats.reduction).toBe(0);
    expect(stats.savedBytes).toBe(0);
  });
});
