import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { HashRouter } from 'react-router';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './store';
import './i18n/i18n';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <CssBaseline />
        <App />
      </HashRouter>
    </Provider>
  </StrictMode>,
);
