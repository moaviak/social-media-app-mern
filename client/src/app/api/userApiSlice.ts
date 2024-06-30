import { IPost, IUser } from "@/types";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query<IUser, string>({
      query: (id) => ({
        url: `/api/users/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => [{ type: "User", id: result?._id }],
    }),
    getTopCreators: builder.query<IUser[], undefined>({
      query: () => ({
        url: "/api/users/creators",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => {
        if (result && result.length > 0) {
          return [
            { type: "User", id: "LIST" },
            ...result.map((user) => ({ type: "User" as const, id: user._id })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),
    followUser: builder.mutation({
      query: ({
        userId,
        isFollowing,
      }: {
        userId: string;
        isFollowing: boolean;
      }) => ({
        url: `/api/users/${userId}/follow`,
        method: "PUT",
        body: { isFollowing },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      invalidatesTags: (_result, _err, arg) => [
        { type: "User", id: arg.userId },
        { type: "Post", id: "LIST" },
      ],
      onQueryStarted: async (
        { userId, isFollowing },
        { dispatch, queryFulfilled }
      ) => {
        if (!isFollowing) {
          try {
            await queryFulfilled;
            dispatch(
              apiSlice.util.updateQueryData(
                "getRecentPosts" as never,
                { page: 1 } as never,
                (draftPosts: {
                  recentPosts: IPost[];
                  nextPage: number;
                  page: number;
                }) => {
                  draftPosts.recentPosts = draftPosts.recentPosts.filter(
                    (post) => post.creator._id !== userId
                  );
                }
              )
            );
          } catch (e) {
            console.log(e);
          }
        }
      },
    }),
    getUserPosts: builder.query<IPost[], string>({
      query: (userId) => ({
        url: `/api/users/${userId}/posts`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => {
        if (result) {
          return [
            { type: "User", id: result[0].creator._id },
            { type: "Post", id: "LIST" },
            ...result.map((post) => ({
              type: "Post" as const,
              id: post._id,
            })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),
    getAllUsers: builder.query<IUser[], unknown>({
      query: () => ({
        url: "/api/users",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => {
        if (result && result.length > 0) {
          return [
            { type: "User", id: "LIST" },
            ...result.map((user) => ({ type: "User" as const, id: user._id })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),
    updateUser: builder.mutation<{ userId: string }, FormData>({
      query: (formData) => ({
        url: "/api/users",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result) => {
        if (result) {
          return [{ type: "User", id: result.userId }];
        } else {
          return [{ type: "User", id: "LISIT" }];
        }
      },
    }),
    getUserFollowers: builder.query<IUser[], string>({
      query: (userId) => ({
        url: `/api/users/${userId}/followers`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => {
        if (result) {
          return [
            { type: "User", id: "LIST" },
            ...result.map((user) => ({
              type: "User" as const,
              id: user._id,
            })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),
    getUserFollowing: builder.query<IUser[], string>({
      query: (userId) => ({
        url: `/api/users/${userId}/following`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => {
        if (result) {
          return [
            { type: "User", id: "LIST" },
            ...result.map((user) => ({
              type: "User" as const,
              id: user._id,
            })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),
    searchUsers: builder.query<IUser[], { term: string }>({
      query: ({ term }) => ({
        url: `/api/users/search?term=${term}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => {
        if (result) {
          return [
            { type: "User", id: "LIST" },
            ...result.map((user) => ({
              type: "User" as const,
              id: user._id,
            })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetTopCreatorsQuery,
  useFollowUserMutation,
  useGetUserPostsQuery,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
  useSearchUsersQuery,
} = userApiSlice;
