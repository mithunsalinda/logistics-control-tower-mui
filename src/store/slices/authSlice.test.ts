import { beforeEach, describe, expect, it } from 'vitest';

import authReducer, { login, logout, setCredentials } from './authSlice';

describe('auth slice state logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('logs in using an email-derived user', () => {
    const state = authReducer(undefined, login({ email: 'admin@nexus.com' }));

    expect(state).toMatchObject({
      isAuthenticated: true,
      user: { name: 'admin', role: 'Administrator' },
    });
  });

  it('stores credentials from the API response', () => {
    const state = authReducer(
      undefined,
      setCredentials({
        id: 'usr-001',
        email: 'dispatcher@nexus.com',
        name: 'Demo Dispatcher',
        role: 'Dispatcher',
      }),
    );

    expect(state.user?.email).toBe('dispatcher@nexus.com');
    expect(state.isAuthenticated).toBe(true);
  });

  it('clears auth state on logout', () => {
    const authenticated = authReducer(undefined, login({ email: 'dispatcher@nexus.com' }));
    const state = authReducer(authenticated, logout());

    expect(state).toEqual({ isAuthenticated: false, user: null });
  });
});
