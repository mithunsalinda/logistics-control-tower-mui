import { beforeEach, describe, expect, it } from 'vitest';

import {
  canAccess,
  clearPersistedAuth,
  createUserFromEmail,
  getPersistedAuth,
  persistAuth,
} from './auth';

describe('auth utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates role-aware demo users from email', () => {
    expect(createUserFromEmail('admin@nexus.com')).toMatchObject({
      name: 'admin',
      role: 'Administrator',
    });
    expect(createUserFromEmail('demo.dispatcher@nexus.com')).toMatchObject({
      name: 'demo dispatcher',
      role: 'Dispatcher',
    });
  });

  it('checks route access against optional allowed roles', () => {
    expect(canAccess(undefined)).toBe(true);
    expect(canAccess('Dispatcher', ['Dispatcher'])).toBe(true);
    expect(canAccess('Dispatcher', ['Administrator'])).toBe(false);
    expect(canAccess(undefined, ['Administrator'])).toBe(false);
  });

  it('persists, reads, and clears auth state', () => {
    persistAuth({
      isAuthenticated: true,
      user: { id: 'usr-1', email: 'dispatcher@nexus.com', name: 'Dispatcher', role: 'Dispatcher' },
    });

    expect(getPersistedAuth()).toEqual({
      isAuthenticated: true,
      user: { id: 'usr-1', email: 'dispatcher@nexus.com', name: 'Dispatcher', role: 'Dispatcher' },
    });

    clearPersistedAuth();

    expect(getPersistedAuth()).toEqual({ isAuthenticated: false, user: null });
  });
});
