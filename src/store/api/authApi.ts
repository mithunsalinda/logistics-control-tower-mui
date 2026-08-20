import type { LoginRequest, LoginResponse, User } from '../../features/login/Login.types';
import { baseApi } from './baseApi';

interface JsonServerUser extends User {
  password: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      queryFn: async ({ email, password }, _api, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ(
          `/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        );

        if (result.error) {
          return { error: result.error };
        }

        const users = result.data as JsonServerUser[];
        const user = users[0];

        if (!user) {
          return {
            error: {
              status: 401,
              data: { message: 'Invalid email or password' },
            },
          };
        }

        const authenticatedUser: User = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };

        return {
          data: {
            user: authenticatedUser,
          },
        };
      },
    }),
    logout: builder.mutation<void, void>({
      queryFn: async () => ({ data: undefined }),
    }),
    getMe: builder.query<LoginResponse['user'], void>({
      query: () => '/users/usr-001',
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;
