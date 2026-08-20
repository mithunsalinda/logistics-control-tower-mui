import { createTheme } from '@mui/material/styles';

import type { AppThemeMode } from './theme.constants';

export function createAppTheme(mode: AppThemeMode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
        dark: '#115293',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#0f1724' : '#f5f7fb',
        paper: isDark ? '#182235' : '#ffffff',
      },
      text: {
        primary: isDark ? '#e7edf5' : '#10243a',
        secondary: isDark ? '#a9b7c8' : '#64758a',
      },
      divider: isDark ? '#2a3a52' : '#d9e3ed',
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#0f1724' : '#f5f7fb',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
}
