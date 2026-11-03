import { describe, it, expect } from 'vitest';
import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  normalizeSettings,
  shouldTypeOutput,
  loadSettings,
  saveSettings,
} from './settings';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = String(v);
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
};

describe('normalizeSettings', () => {
  it('keeps valid typing modes', () => {
    expect(normalizeSettings({ typing: 'off' })).toEqual({ typing: 'off' });
    expect(normalizeSettings({ typing: 'always' })).toEqual({ typing: 'always' });
  });

  it('falls back to defaults for missing or invalid values', () => {
    expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings({ typing: 'turbo' })).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings('nonsense')).toEqual(DEFAULT_SETTINGS);
  });

  it('drops unknown keys', () => {
    expect(normalizeSettings({ typing: 'off', evil: true })).toEqual({ typing: 'off' });
  });
});

describe('shouldTypeOutput', () => {
  it('auto follows the reduced-motion preference', () => {
    expect(shouldTypeOutput('auto', false)).toBe(true);
    expect(shouldTypeOutput('auto', true)).toBe(false);
  });

  it('always types, even with reduced motion', () => {
    expect(shouldTypeOutput('always', true)).toBe(true);
  });

  it('off never types', () => {
    expect(shouldTypeOutput('off', false)).toBe(false);
  });
});

describe('loadSettings / saveSettings', () => {
  it('round-trips through storage', () => {
    const storage = memoryStorage();
    expect(saveSettings(storage, { typing: 'off' })).toBe(true);
    expect(loadSettings(storage)).toEqual({ typing: 'off' });
  });

  it('returns defaults for empty or corrupt storage', () => {
    expect(loadSettings(memoryStorage())).toEqual(DEFAULT_SETTINGS);
    expect(loadSettings(memoryStorage({ [SETTINGS_STORAGE_KEY]: '{not json' }))).toEqual(DEFAULT_SETTINGS);
  });

  it('never throws when storage is blocked', () => {
    expect(loadSettings(throwingStorage)).toEqual(DEFAULT_SETTINGS);
    expect(saveSettings(throwingStorage, { typing: 'off' })).toBe(false);
    expect(loadSettings(undefined)).toEqual(DEFAULT_SETTINGS);
  });
});
