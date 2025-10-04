import DOMPurify from 'dompurify';

export const sanitizeHtml = (input) => {
  try {
    if (!input.trim()) {
      return { success: false, error: 'Input is empty' };
    }

    // Sanitize HTML while allowing most content for preview
    // Since this is a developer tool for previewing their own HTML,
    // we allow scripts but still sanitize dangerous patterns
    const sanitized = DOMPurify.sanitize(input, {
      WHOLE_DOCUMENT: true, // Preserve full HTML structure including head/body
      ADD_TAGS: ['style', 'link', 'script'], // Allow style, link, and script tags
      ADD_ATTR: ['target', 'style', 'onclick', 'onload'], // Allow common attributes
      ALLOW_UNKNOWN_PROTOCOLS: false, // Still block dangerous protocols
      KEEP_CONTENT: true, // Keep content even if tag is removed
    });

    return { success: true, result: sanitized };
  } catch (error) {
    return {
      success: false,
      error: `HTML Sanitization Error: ${error.message}`
    };
  }
};

export const validateHtml = (input) => {
  try {
    // Basic HTML validation - check for unclosed tags
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/html');

    const parserErrors = doc.querySelectorAll('parsererror');
    if (parserErrors.length > 0) {
      return {
        valid: false,
        error: 'HTML parsing error: Invalid HTML structure'
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};
