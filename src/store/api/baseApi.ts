import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3002',
  }),
  tagTypes: [
    'Dashboard',
    'Shipments',
    'Fleet',
    'Exceptions',
    'Facilities',
    'Capacity',
    'Routes',
    'Users',
    'Audit',
  ],
  endpoints: () => ({}),
});
