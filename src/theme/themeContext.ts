import { createContext, useContext } from 'react';

import type { AppThemeMode } from './theme.constants';

interface ThemeModeContextValue {
  mode: AppThemeMode;
  toggleMode: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used inside AppThemeProvider');
  }

  return context;
}
