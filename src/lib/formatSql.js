import { format } from 'sql-formatter';

export const formatSql = (input, options = {}) => {
  const { 
    dialect = 'sql', 
    uppercase = true, 
    indentSize = 2 
  } = options;
  
  try {
    if (!input.trim()) {
      return { success: false, error: 'Input is empty' };
    }

    const formatted = format(input, {
      language: dialect,
      uppercase,
      tabWidth: indentSize,
      keywordCase: uppercase ? 'upper' : 'lower',
    });
    
    return { success: true, result: formatted };
  } catch (error) {
    return { 
      success: false, 
      error: `SQL Format Error: ${error.message}` 
    };
  }
};

export const sqlDialects = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'plsql', label: 'PL/SQL' },
  { value: 'transactsql', label: 'T-SQL' },
];