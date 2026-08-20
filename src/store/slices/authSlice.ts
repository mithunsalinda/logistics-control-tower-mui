import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  clearPersistedAuth,
  createUserFromEmail,
  getPersistedAuth,
  persistAuth,
  type AuthUser,
} from '../../utils/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

const initialState: AuthState = getPersistedAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ email: string }>) {
      state.isAuthenticated = true;
      state.user = createUserFromEmail(action.payload.email);
      persistAuth(state);
    },
    setCredentials(state, action: PayloadAction<AuthUser>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      persistAuth(state);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      clearPersistedAuth();
    },
  },
});

export const { login, logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;
