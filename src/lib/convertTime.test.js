import { describe, it, expect } from 'vitest';
import { convertTimestamp, getCurrentTimestamp } from './convertTime';

describe('convertTimestamp', () => {
  it('parses a 10-digit unix seconds timestamp', () => {
    const result = convertTimestamp('1640995200');
    expect(result.success).toBe(true);
    expect(result.result.inputType).toBe('unix_seconds');
    expect(result.result.unixSeconds).toBe(1640995200);
    expect(result.result.iso8601).toBe('2022-01-01T00:00:00.000Z');
  });

  it('parses a 13-digit unix milliseconds timestamp', () => {
    const result = convertTimestamp('1640995200000');
    expect(result.success).toBe(true);
    expect(result.result.inputType).toBe('unix_milliseconds');
    expect(result.result.unixMilliseconds).toBe(1640995200000);
  });

  it('parses an ISO 8601 string', () => {
    const result = convertTimestamp('2022-01-01T00:00:00.000Z');
    expect(result.success).toBe(true);
    expect(result.result.inputType).toBe('iso_string');
    expect(result.result.unixSeconds).toBe(1640995200);
  });

  it('rejects empty input', () => {
    const result = convertTimestamp('   ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Input is empty');
  });

  it('rejects an unparseable date string', () => {
    const result = convertTimestamp('not a date');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid timestamp format');
  });
});

describe('getCurrentTimestamp', () => {
  it('returns a self-consistent snapshot of the current time', () => {
    const now = getCurrentTimestamp();
    expect(Math.floor(now.unixMilliseconds / 1000)).toBe(now.unixSeconds);
    expect(now.iso8601).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});
