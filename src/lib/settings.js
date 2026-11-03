/**
 * User preferences that are not the colour theme (which App.jsx owns).
 * Pure helpers only — React wiring lives in components/Common/SettingsProvider.
 */

export const SETTINGS_STORAGE_KEY = 'devtools-settings';

/**
 * How formatted output appears:
 *  - auto:   type it out unless the OS asks for reduced motion (default)
 *  - always: type it out even with reduced motion (explicit user choice)
 *  - off:    show it instantly
 */
export const TYPING_MODES = ['auto', 'always', 'off'];

export const DEFAULT_SETTINGS = Object.freeze({ typing: 'auto' });

/** Coerce anything (stored JSON, partial objects, junk) into valid settings. */
export function normalizeSettings(value) {
  const typing = TYPING_MODES.includes(value?.typing) ? value.typing : DEFAULT_SETTINGS.typing;
  return { typing };
}

/** Whether the typing reveal should run for a given mode and OS preference. */
export function shouldTypeOutput(mode, reducedMotion) {
  if (mode === 'always') return true;
  if (mode === 'off') return false;
  return !reducedMotion;
}

/** Read settings from a Storage-like object; never throws. */
export function loadSettings(storage) {
  try {
    const raw = storage?.getItem(SETTINGS_STORAGE_KEY);
    return normalizeSettings(raw ? JSON.parse(raw) : null);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/** Persist settings to a Storage-like object; returns false if storage is unavailable. */
export function saveSettings(storage, settings) {
  try {
    storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(normalizeSettings(settings)));
    return true;
  } catch {
    return false;
  }
}
