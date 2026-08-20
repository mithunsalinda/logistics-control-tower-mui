import { combineReducers } from '@reduxjs/toolkit';

import { baseApi } from './api';
import { authReducer } from './slices';

export const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
