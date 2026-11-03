import { useCallback, useMemo, useState } from 'react';
import { SettingsContext } from './settingsContext';
import { loadSettings, normalizeSettings, saveSettings } from '../../lib/settings';

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

  const [introRun, setIntroRun] = useState(0);
  const replayIntro = useCallback(() => setIntroRun((n) => n + 1), []);

  const value = useMemo(
    () => ({ settings, updateSettings, introRun, replayIntro }),
    [settings, updateSettings, introRun, replayIntro],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
