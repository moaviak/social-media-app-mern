import { logout, setCredentials } from "@/app/authSlice";
import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth",
        method: "PUT",
        body: { ...credentials },
      }),
    }),

    signup: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "/api/auth/refresh",
        method: "GET",
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data;

          dispatch(setCredentials({ token: accessToken }));
        } catch (error) {
          console.error(error);
        }
      },
    }),

    sendLogout: builder.mutation({
      query: () => ({
        url: "/api/auth",
        method: "DELETE",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(logout());

          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (error) {
          console.error(error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useRefreshTokenMutation,
  useSendLogoutMutation,
} = authApiSlice;
