import { describe, it, expect } from 'vitest';
import { formatSql, sqlDialects } from './formatSql';

describe('formatSql', () => {
  it('formats a simple query with uppercase keywords by default', () => {
    const result = formatSql('select * from users where id = 1');
    expect(result.success).toBe(true);
    expect(result.result).toContain('SELECT');
    expect(result.result).toContain('FROM');
    expect(result.result).toContain('WHERE');
  });

  it('keeps keywords lowercase when uppercase is false', () => {
    const result = formatSql('SELECT * FROM users', { uppercase: false });
    expect(result.success).toBe(true);
    expect(result.result).toContain('select');
    expect(result.result).not.toContain('SELECT');
  });

  it('rejects empty input', () => {
    const result = formatSql('   ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Input is empty');
  });

  it('reports a format error for unsupported dialect', () => {
    const result = formatSql('SELECT 1', { dialect: 'not-a-real-dialect' });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/SQL Format Error/);
  });

  it('exposes the list of supported dialects', () => {
    expect(sqlDialects.length).toBeGreaterThan(0);
    expect(sqlDialects.map((d) => d.value)).toContain('postgresql');
  });
});
