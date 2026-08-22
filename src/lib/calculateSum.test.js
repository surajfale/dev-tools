import { describe, it, expect } from 'vitest';
import { calculateSum, formatNumber } from './calculateSum';

describe('calculateSum', () => {
  it('sums numbers separated by commas, spaces, and newlines', () => {
    const result = calculateSum('10, 20\n30.5 45.75');
    expect(result.success).toBe(true);
    expect(result.result.sum).toBe(106.25);
    expect(result.result.count).toBe(4);
    expect(result.result.min).toBe(10);
    expect(result.result.max).toBe(45.75);
    expect(result.result.average).toBeCloseTo(26.5625);
  });

  it('rejects empty input', () => {
    const result = calculateSum('   ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Input is empty');
  });

  it('reports invalid tokens without silently dropping them', () => {
    const result = calculateSum('10, abc, 20');
    expect(result.success).toBe(false);
    expect(result.error).toContain('abc');
  });
});

describe('formatNumber', () => {
  it('formats with thousands separators and two decimals by default', () => {
    expect(formatNumber(1234.5)).toBe('1,234.50');
  });

  it('respects a custom decimal count', () => {
    expect(formatNumber(1234.5678, 1)).toBe('1,234.6');
  });
});
