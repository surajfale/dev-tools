import { describe, it, expect } from 'vitest';
import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  normalizeSettings,
  shouldTypeOutput,
  shouldPlayIntro,
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
    expect(normalizeSettings({ typing: 'off', intro: 'always' })).toEqual({ typing: 'off', intro: 'always', remember: 'on' });
    expect(normalizeSettings({ typing: 'always', intro: 'off' })).toEqual({ typing: 'always', intro: 'off', remember: 'on' });
  });

  it('falls back to defaults for missing or invalid values', () => {
    expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings({ typing: 'turbo', intro: 'loud' })).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings('nonsense')).toEqual(DEFAULT_SETTINGS);
  });

  it('keeps a valid remember mode and rejects junk', () => {
    expect(normalizeSettings({ remember: 'off' }).remember).toBe('off');
    expect(normalizeSettings({ remember: true }).remember).toBe('on');
  });

  it('drops unknown keys', () => {
    expect(normalizeSettings({ typing: 'off', evil: true })).toEqual({ typing: 'off', intro: 'session', remember: 'on' });
  });

  it('upgrades settings saved before a field existed', () => {
    // A user who saved only `typing` keeps it and gets the default intro mode.
    expect(normalizeSettings({ typing: 'off' })).toEqual({ typing: 'off', intro: 'session', remember: 'on' });
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

describe('shouldPlayIntro', () => {
  it('session plays only on the first load of a session', () => {
    expect(shouldPlayIntro('session', { seenThisSession: false })).toBe(true);
    expect(shouldPlayIntro('session', { seenThisSession: true })).toBe(false);
  });

  it('always plays on every load', () => {
    expect(shouldPlayIntro('always', { seenThisSession: true })).toBe(true);
  });

  it('off never plays', () => {
    expect(shouldPlayIntro('off')).toBe(false);
  });

  it('reduced motion suppresses every mode', () => {
    for (const mode of ['session', 'always', 'off']) {
      expect(shouldPlayIntro(mode, { reducedMotion: true })).toBe(false);
    }
  });
});

describe('loadSettings / saveSettings', () => {
  it('round-trips through storage', () => {
    const storage = memoryStorage();
    expect(saveSettings(storage, { typing: 'off', intro: 'always' })).toBe(true);
    expect(loadSettings(storage)).toEqual({ typing: 'off', intro: 'always', remember: 'on' });
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
