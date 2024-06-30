import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "@/app/authSlice";
import type { RootState } from "../store";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface RefreshTokenResponse {
  accessToken: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_REACT_APP_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    const refreshResult = await baseQuery(
      "/api/auth/refresh",
      api,
      extraOptions
    );
    if (refreshResult?.data) {
      const { accessToken } = refreshResult.data as RefreshTokenResponse;
      api.dispatch(setCredentials({ token: accessToken }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "snapgramApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Post", "User", "Comment"],
  endpoints: () => ({}),
});
