/**
 * Per-tool input persistence (the "Remember input" setting).
 * Pure helpers over a Storage-like object; React wiring lives in
 * components/Common/useStoredState.js. Nothing here ever throws: storage can
 * be blocked, full, or hold junk from an older version.
 */

export const STORED_INPUT_PREFIX = 'devtools-input:';

// Keeps one huge paste from eating the ~5 MB localStorage quota (UTF-16, so
// this is ~1 MB). Larger values are not stored and any older copy is removed,
// so a restart never resurrects a stale, smaller version of the input.
export const MAX_STORED_CHARS = 500000;

const storageKey = (key) => STORED_INPUT_PREFIX + key;

/**
 * Read a stored value. Returns `fallback` when nothing is stored, the stored
 * value is unreadable, its type differs from `fallback`, or `validate` rejects it.
 */
export function readStored(storage, key, fallback, validate) {
  try {
    const raw = storage?.getItem(storageKey(key));
    if (raw == null) return fallback;
    const value = JSON.parse(raw);
    if (typeof value !== typeof fallback) return fallback;
    if (validate && !validate(value)) return fallback;
    return value;
  } catch {
    return fallback;
  }
}

/**
 * Store a value, or remove it when it equals `fallback` (e.g. an empty input)
 * or is too large. Returns false if storage is unavailable.
 */
export function writeStored(storage, key, value, fallback) {
  try {
    const tooLarge = typeof value === 'string' && value.length > MAX_STORED_CHARS;
    if (value === fallback || tooLarge) {
      storage.removeItem(storageKey(key));
    } else {
      storage.setItem(storageKey(key), JSON.stringify(value));
    }
    return true;
  } catch {
    return false;
  }
}

/** Delete every stored tool input (used when "Remember input" is turned off). */
export function purgeStored(storage) {
  try {
    const keys = [];
    for (let i = 0; i < storage.length; i += 1) {
      const k = storage.key(i);
      if (k?.startsWith(STORED_INPUT_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => storage.removeItem(k));
    return keys.length;
  } catch {
    return 0;
  }
}
