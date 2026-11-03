import { createContext, useContext } from 'react';
import { DEFAULT_SETTINGS } from '../../lib/settings';

// Default value lets components render outside the provider (e.g. in tests).
export const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  introRun: 0,
  replayIntro: () => {},
});

/**
 * `{ settings, updateSettings(partial), introRun, replayIntro() }`
 * `introRun` increments each time the user asks to replay the intro.
 */
export function useSettings() {
  return useContext(SettingsContext);
}
