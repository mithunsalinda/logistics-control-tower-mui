export interface AuthUser {
  name: string;
  role: 'Dispatcher' | 'Operations Manager' | 'Administrator';
}

const AUTHENTICATION_KEY = 'logistics-app-authenticated';
const AUTH_USER_KEY = 'logistics-app-user';

export const createUserFromEmail = (email: string): AuthUser => ({
  name: email.split('@')[0]?.replace(/[._]/g, ' ') || 'Demo Operator',
  role: email.includes('admin') ? 'Administrator' : 'Dispatcher',
});

export const getPersistedAuth = () => {
  const isAuthenticated = localStorage.getItem(AUTHENTICATION_KEY) === 'true';
  const userJson = localStorage.getItem(AUTH_USER_KEY);

  return {
    isAuthenticated,
    user: isAuthenticated && userJson ? (JSON.parse(userJson) as AuthUser) : null,
  };
};

export const persistAuth = (auth: { isAuthenticated: boolean; user: AuthUser | null }) => {
  localStorage.setItem(AUTHENTICATION_KEY, auth.isAuthenticated ? 'true' : 'false');

  if (auth.user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(auth.user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

export const clearPersistedAuth = () => {
  localStorage.removeItem(AUTHENTICATION_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};
