export interface AuthUser {
  id?: string;
  email?: string;
  name: string;
  role: UserRole;
}

export type UserRole =
  | 'Dispatcher'
  | 'Operations Manager'
  | 'Planner'
  | 'Warehouse Coordinator'
  | 'Administrator'
  | 'Read-only Viewer';

const AUTHENTICATION_KEY = 'logistics-app-authenticated';
const AUTH_USER_KEY = 'logistics-app-user';

export const createUserFromEmail = (email: string): AuthUser => ({
  name: email.split('@')[0]?.replace(/[._]/g, ' ') || 'Demo Operator',
  role: email.includes('admin') ? 'Administrator' : 'Dispatcher',
});

export const canAccess = (role: string | undefined, allowedRoles?: UserRole[]) => {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return Boolean(role && allowedRoles.includes(role as UserRole));
};

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
