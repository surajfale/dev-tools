import { useCallback, useMemo, useState } from 'react';
import { SettingsContext } from './settingsContext';
import { loadSettings, normalizeSettings, saveSettings } from '../../lib/settings';

const storage = () => (typeof window === 'undefined' ? undefined : window.localStorage);

/** Holds user preferences in state and mirrors them to localStorage. */
export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => loadSettings(storage()));

  const updateSettings = useCallback((partial) => {
    setSettings((prev) => {
      const next = normalizeSettings({ ...prev, ...partial });
      saveSettings(storage(), next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
