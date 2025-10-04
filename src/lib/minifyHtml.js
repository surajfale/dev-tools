/**
 * Minify HTML by removing comments, whitespace, and optimizing CSS
 * This helps reduce URL length for shareable preview links
 */

export const minifyHtml = (html) => {
  let minified = html;

  // Remove HTML comments (but keep IE conditional comments)
  minified = minified.replace(/<!--(?!\[if\s)(?!<!)[^\[].*?-->/gs, '');

  // Remove CSS comments
  minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove JavaScript comments (// style)
  minified = minified.replace(/\/\/.*$/gm, '');

  // Minify inline CSS - remove extra spaces and line breaks
  minified = minified.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css) => {
    const minifiedCss = css
      // Remove newlines and extra spaces
      .replace(/\s+/g, ' ')
      // Remove spaces around { } : ; ,
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*,\s*/g, ',')
      // Remove last semicolon before }
      .replace(/;}/g, '}')
      // Remove spaces around > + ~
      .replace(/\s*>\s*/g, '>')
      .replace(/\s*\+\s*/g, '+')
      .replace(/\s*~\s*/g, '~')
      .trim();
    return `<style>${minifiedCss}</style>`;
  });

  // Minify inline JavaScript
  minified = minified.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, js) => {
    const minifiedJs = js
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s*=\s*/g, '=')
      .trim();
    return match.includes('src=') ? match : `<script>${minifiedJs}</script>`;
  });

  // Remove whitespace between tags (but preserve spaces in text content)
  minified = minified.replace(/>\s+</g, '><');

  // Remove leading/trailing whitespace in tags
  minified = minified.replace(/<([^>]+)\s+>/g, '<$1>');

  // Remove multiple spaces in text content
  minified = minified.replace(/\s{2,}/g, ' ');

  // Remove spaces around = in attributes
  minified = minified.replace(/\s*=\s*/g, '=');

  // Remove optional closing tags to save space (if safe)
  // minified = minified.replace(/<\/li>\s*<li/gi, '<li');
  // minified = minified.replace(/<\/p>\s*<p/gi, '<p');

  // Trim the whole thing
  minified = minified.trim();

  return minified;
};

/**
 * Calculate size reduction percentage
 */
export const calculateCompression = (original, minified) => {
  const originalSize = new Blob([original]).size;
  const minifiedSize = new Blob([minified]).size;
  const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);

  return {
    originalSize,
    minifiedSize,
    reduction: parseFloat(reduction),
    savedBytes: originalSize - minifiedSize
  };
};
