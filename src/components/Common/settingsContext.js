import { createContext, useContext } from 'react';
import { DEFAULT_SETTINGS } from '../../lib/settings';

// Default value lets components render outside the provider (e.g. in tests).
export const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
});

/** `{ settings, updateSettings(partial) }` */
export function useSettings() {
  return useContext(SettingsContext);
}
