import { describe, it, expect } from 'vitest';
import { MAX_STORED_CHARS, STORED_INPUT_PREFIX, purgeStored, readStored, writeStored } from './storedInput';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = String(v);
    },
    removeItem: (k) => {
      delete data[k];
    },
    key: (i) => Object.keys(data)[i] ?? null,
    get length() {
      return Object.keys(data).length;
    },
    data,
  };
}

const throwingStorage = {
  getItem() {
    throw new Error('blocked');
  },
  setItem() {
    throw new Error('blocked');
  },
  removeItem() {
    throw new Error('blocked');
  },
  get length() {
    throw new Error('blocked');
  },
};

describe('readStored / writeStored', () => {
  it('round-trips a value under a namespaced key', () => {
    const s = memoryStorage();
    expect(writeStored(s, 'json', '{"a":1}', '')).toBe(true);
    expect(s.data[`${STORED_INPUT_PREFIX}json`]).toBe('"{\\"a\\":1}"');
    expect(readStored(s, 'json', '')).toBe('{"a":1}');
  });

  it('returns the fallback when nothing is stored', () => {
    expect(readStored(memoryStorage(), 'json', '')).toBe('');
  });

  it('removes the entry when the value is back to its fallback', () => {
    const s = memoryStorage();
    writeStored(s, 'json', 'x', '');
    writeStored(s, 'json', '', '');
    expect(s.data).toEqual({});
  });

  it('does not store oversized input and drops any older copy', () => {
    const s = memoryStorage();
    writeStored(s, 'json', 'small', '');
    writeStored(s, 'json', 'x'.repeat(MAX_STORED_CHARS + 1), '');
    expect(readStored(s, 'json', '')).toBe('');
  });

  it('ignores junk, wrong types and values the validator rejects', () => {
    const s = memoryStorage({
      [`${STORED_INPUT_PREFIX}a`]: '{not json',
      [`${STORED_INPUT_PREFIX}b`]: '42',
      [`${STORED_INPUT_PREFIX}c`]: '"sideways"',
    });
    expect(readStored(s, 'a', '')).toBe('');
    expect(readStored(s, 'b', '')).toBe('');
    expect(readStored(s, 'c', 'md-to-html', (v) => ['md-to-html', 'html-to-md'].includes(v))).toBe('md-to-html');
  });

  it('never throws when storage is blocked', () => {
    expect(readStored(throwingStorage, 'json', 'fb')).toBe('fb');
    expect(writeStored(throwingStorage, 'json', 'x', '')).toBe(false);
    expect(readStored(undefined, 'json', 'fb')).toBe('fb');
  });
});

describe('purgeStored', () => {
  it('removes only tool inputs', () => {
    const s = memoryStorage({
      [`${STORED_INPUT_PREFIX}json`]: '"a"',
      [`${STORED_INPUT_PREFIX}sql`]: '"b"',
      theme: 'dark',
      'devtools-settings': '{}',
    });
    expect(purgeStored(s)).toBe(2);
    expect(Object.keys(s.data).sort()).toEqual(['devtools-settings', 'theme']);
  });

  it('never throws when storage is blocked', () => {
    expect(purgeStored(throwingStorage)).toBe(0);
  });
});
