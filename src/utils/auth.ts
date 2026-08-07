const AUTHENTICATION_KEY = 'logistics-app-authenticated';

export const loginUser = (): void => {
  localStorage.setItem(AUTHENTICATION_KEY, 'true');
};

export const logoutUser = (): void => {
  localStorage.removeItem(AUTHENTICATION_KEY);
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTHENTICATION_KEY) === 'true';
};
