import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';

import AppThemeProvider from '../theme/AppThemeProvider';
import { store } from '../store';

export function renderWithProviders(ui: ReactElement) {
  return {
    ui,
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </AppThemeProvider>
      </Provider>
    ),
  };
}
