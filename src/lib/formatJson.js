export const formatJson = (input, options = {}) => {
  const { indent = 2, minify = false, sortKeys = false } = options;
  
  try {
    if (!input.trim()) {
      return { success: false, error: 'Input is empty' };
    }

    let parsed = JSON.parse(input);
    
    if (sortKeys) {
      parsed = sortObjectKeys(parsed);
    }
    
    const formatted = minify 
      ? JSON.stringify(parsed)
      : JSON.stringify(parsed, null, indent);
    
    return { success: true, result: formatted };
  } catch (error) {
    return { 
      success: false, 
      error: `JSON Parse Error: ${error.message}`,
      line: extractLineNumber(error.message)
    };
  }
};

const sortObjectKeys = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  
  const sorted = {};
  Object.keys(obj).sort().forEach(key => {
    sorted[key] = sortObjectKeys(obj[key]);
  });
  
  return sorted;
};

const extractLineNumber = (errorMessage) => {
  const match = errorMessage.match(/position (\d+)/);
  return match ? `around position ${match[1]}` : null;
};

export const validateJson = (input) => {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error.message,
      line: extractLineNumber(error.message)
    };
  }
};