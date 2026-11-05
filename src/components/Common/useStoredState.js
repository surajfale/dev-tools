import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from './settingsContext';
import { readStored, writeStored } from '../../lib/storedInput';

const storage = () => (typeof window === 'undefined' ? undefined : window.localStorage);
const WRITE_DELAY_MS = 300;

/**
 * `useState` that survives navigation and app restarts when the user's
 * "Remember input" setting is on. `key` names the slot (e.g. 'json.input');
 * `initial` must be a primitive and doubles as the "nothing stored" value.
 *
 * Writes are debounced while typing, then flushed immediately when the page
 * is hidden (Android may kill a backgrounded installed app without warning)
 * and when the component unmounts (switching tools).
 */
export default function useStoredState(key, initial, validate) {
  const { settings } = useSettings();
  const enabled = settings.remember === 'on';
  const [value, setValue] = useState(() => (enabled ? readStored(storage(), key, initial, validate) : initial));

  const latestRef = useRef(value);
  const flush = useCallback(() => {
    if (enabled) writeStored(storage(), key, latestRef.current, initial);
  }, [enabled, key, initial]);

  useEffect(() => {
    latestRef.current = value;
    if (!enabled) return undefined;
    const id = setTimeout(flush, WRITE_DELAY_MS);
    return () => clearTimeout(id);
  }, [value, enabled, flush]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [flush]);

  return [value, setValue];
}
