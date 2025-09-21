import yaml from 'js-yaml';

export const convertJsonToYaml = (json) => {
  try {
    if (!json.trim()) {
      return { success: false, error: 'Input is empty' };
    }

    const parsed = JSON.parse(json);
    const yamlResult = yaml.dump(parsed, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
    });
    
    return { success: true, result: yamlResult };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { 
        success: false, 
        error: `JSON Parse Error: ${error.message}` 
      };
    }
    return { 
      success: false, 
      error: `YAML conversion error: ${error.message}` 
    };
  }
};

export const convertYamlToJson = (yamlInput, options = {}) => {
  const { indent = 2, minify = false } = options;
  
  try {
    if (!yamlInput.trim()) {
      return { success: false, error: 'Input is empty' };
    }

    const parsed = yaml.load(yamlInput);
    const jsonResult = minify 
      ? JSON.stringify(parsed)
      : JSON.stringify(parsed, null, indent);
    
    return { success: true, result: jsonResult };
  } catch (error) {
    return { 
      success: false, 
      error: `YAML Parse Error: ${error.message}` 
    };
  }
};

export const validateYaml = (yamlInput) => {
  try {
    yaml.load(yamlInput);
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error.message 
    };
  }
};