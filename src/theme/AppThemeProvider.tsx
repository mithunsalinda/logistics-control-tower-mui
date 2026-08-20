import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { createAppTheme } from './appTheme';
import { type AppThemeMode, themePreferenceKey } from './theme.constants';
import { ThemeModeContext } from './themeContext';

interface AppThemeProviderProps {
  children: ReactNode;
}

function getInitialThemeMode(): AppThemeMode {
  const savedMode = localStorage.getItem(themePreferenceKey);

  if (savedMode === 'dark' || savedMode === 'light') {
    return savedMode;
  }

  return 'light';
}

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [mode, setMode] = useState<AppThemeMode>(getInitialThemeMode);
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const contextValue = useMemo(
    () => ({
      mode,
      toggleMode: () => {
        setMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [mode],
  );

  useEffect(() => {
    localStorage.setItem(themePreferenceKey, mode);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalThemeStyles} />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

const globalThemeStyles = {
  ':root': {
    '--app-bg': '#f5f7fb',
    '--app-shell': '#f4f8fc',
    '--app-surface': '#ffffff',
    '--app-surface-soft': '#f8fbfd',
    '--app-surface-muted': '#f2f6fa',
    '--app-border': '#d9e3ed',
    '--app-border-soft': '#e8eef5',
    '--app-text': '#10243a',
    '--app-text-muted': '#64758a',
    '--app-text-soft': '#7a8a9e',
    '--app-hover': '#f6f9fc',
  },
  "html[data-theme='dark']": {
    '--app-bg': '#0f1724',
    '--app-shell': '#121c2b',
    '--app-surface': '#182235',
    '--app-surface-soft': '#1e2a3f',
    '--app-surface-muted': '#22304a',
    '--app-border': '#2a3a52',
    '--app-border-soft': '#24344d',
    '--app-text': '#e7edf5',
    '--app-text-muted': '#a9b7c8',
    '--app-text-soft': '#8fa1b8',
    '--app-hover': '#22304a',
    colorScheme: 'dark',
  },
  body: {
    backgroundColor: 'var(--app-bg)',
  },
  "html[data-theme='dark'] .MuiDrawer-paper": {
    backgroundColor: 'var(--app-surface)',
    borderColor: 'var(--app-border)',
  },
  "html[data-theme='dark'] .MuiCard-root, html[data-theme='dark'] .MuiPaper-root": {
    backgroundColor: 'var(--app-surface)',
    borderColor: 'var(--app-border)',
  },
  "html[data-theme='dark'] .MuiTableCell-root": {
    borderColor: 'var(--app-border)',
    color: 'var(--app-text)',
  },
};
