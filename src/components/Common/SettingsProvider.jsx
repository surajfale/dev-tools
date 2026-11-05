import { useCallback, useEffect, useMemo, useState } from 'react';
import { SettingsContext } from './settingsContext';
import { loadSettings, normalizeSettings, saveSettings } from '../../lib/settings';
import { purgeStored } from '../../lib/storedInput';

const storage = () => (typeof window === 'undefined' ? undefined : window.localStorage);

/**
 * Holds user preferences in state and mirrors them to localStorage.
 * Also carries a non-persisted `introRun` counter so the settings menu can
 * replay the intro without the two components knowing about each other.
 */
export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => loadSettings(storage()));

  const updateSettings = useCallback((partial) => {
    setSettings((prev) => {
      const next = normalizeSettings({ ...prev, ...partial });
      saveSettings(storage(), next);
      return next;
    });
  }, []);

  // Turning "Remember input" off deletes what was stored, not just future writes.
  // Parent effects run after the children's cleanups, so this also wins over a
  // tool's final unmount/flush write in the same commit.
  useEffect(() => {
    if (settings.remember === 'off') purgeStored(storage());
  }, [settings.remember]);

  const [introRun, setIntroRun] = useState(0);
  const replayIntro = useCallback(() => setIntroRun((n) => n + 1), []);

  const value = useMemo(
    () => ({ settings, updateSettings, introRun, replayIntro }),
    [settings, updateSettings, introRun, replayIntro],
  );

  return <SettingsContext value={value}>{children}</SettingsContext>;
}
