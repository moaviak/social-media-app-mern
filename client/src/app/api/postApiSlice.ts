import { IPost } from "@/types";
import { apiSlice } from "./apiSlice";

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation<{ postId: string; userId: string }, FormData>({
      query: (post) => ({
        url: "/api/posts",
        method: "POST",
        body: post,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    getRecentPosts: builder.query<
      {
        recentPosts: IPost[];
        nextPage: number | null;
        page: number;
      },
      { page: number }
    >({
      query: ({ page }) => ({
        url: `/api/posts/recent?page=${page}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
        transformResponse: (
          response: { recentPosts: IPost[]; nextPage: number | null },
          _meta: unknown,
          arg: { page: number }
        ) => {
          return {
            recentPosts: response.recentPosts,
            nextPage: response.nextPage,
            page: arg.page,
          };
        },
      }),
      providesTags: (result) => {
        if (result?.recentPosts && result.recentPosts.length > 0) {
          return [
            { type: "Post", id: "LIST" },
            ...result.recentPosts.map((post) => ({
              type: "Post" as const,
              id: post._id,
            })),
          ];
        } else {
          return [{ type: "Post", id: "LIST" }];
        }
      },
    }),
    likePost: builder.mutation<
      { postId: string; userId: string },
      { postId: string; isLiked: boolean }
    >({
      query: ({ postId, isLiked }) => ({
        url: `/api/posts/${postId}/like`,
        method: "PUT",
        body: { isLiked },
      }),
      invalidatesTags: (result) => {
        if (result) {
          return [
            { type: "Post", id: result.postId },
            { type: "User", id: result.userId },
          ];
        } else {
          return [
            { type: "Post", id: "LIST" },
            { type: "User", id: "LIST" },
          ];
        }
      },
    }),
    savePost: builder.mutation<
      { postId: string; userId: string },
      { postId: string; isSaved: boolean }
    >({
      query: ({ postId, isSaved }) => ({
        url: `/api/posts/${postId}/save`,
        method: "PUT",
        body: { isSaved },
      }),
      invalidatesTags: (result) => [
        { type: "Post", id: result?.postId },
        { type: "User", id: result?.userId },
      ],
    }),
    getPostById: builder.query<IPost, string>({
      query: (postId) => ({
        url: `/api/posts/${postId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => [{ type: "Post", id: result?._id }],
    }),
    updatePost: builder.mutation<
      { postId: string },
      { post: FormData; postId: string }
    >({
      query: ({ post, postId }) => ({
        url: `/api/posts/${postId}`,
        method: "PUT",
        body: post,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Post", id: arg.postId },
      ],
    }),
    deletePost: builder.mutation<{ message: string }, { postId: string }>({
      query: ({ postId }) => ({
        url: `/api/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg: { postId: string }) => [
        { type: "Post", id: arg.postId },
      ],
    }),
    getSavedPosts: builder.query<IPost[], unknown>({
      query: () => ({
        url: "/api/posts/saved",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => {
        if (result && result?.length) {
          return [
            { type: "Post", id: "LIST" },
            ...result.map((post) => ({ type: "Post" as const, id: post._id })),
            ...result.map((post) => ({
              type: "User" as const,
              id: post.creator._id,
            })),
          ];
        } else {
          return [{ type: "Post", id: "LIST" }];
        }
      },
    }),
    getLikedPosts: builder.query<IPost[], unknown>({
      query: () => ({
        url: `/api/posts/liked`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => {
        if (result && result?.length) {
          return [
            { type: "Post", id: "LIST" },
            ...result.map((post) => ({ type: "Post" as const, id: post._id })),
            ...result.map((post) => ({
              type: "User" as const,
              id: post.creator._id,
            })),
          ];
        } else {
          return [{ type: "Post", id: "LIST" }];
        }
      },
    }),
    searchPosts: builder.query<IPost[], { term: string }>({
      query: ({ term }) => ({
        url: `/api/posts/search?term=${term}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => {
        if (result && result?.length) {
          return [
            { type: "Post", id: "LIST" },
            ...result.map((post) => ({ type: "Post" as const, id: post._id })),
          ];
        } else {
          return [{ type: "Post", id: "LIST" }];
        }
      },
    }),
    getPopularPosts: builder.query<
      { popularPosts: IPost[]; nextPage: number | null },
      { page: number }
    >({
      query: ({ page }) => ({
        url: `/api/posts/popular?page=${page}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => {
        if (result?.popularPosts && result?.popularPosts.length) {
          return [
            { type: "Post", id: "LIST" },
            ...result.popularPosts.map((post) => ({
              type: "Post" as const,
              id: post._id,
            })),
          ];
        } else {
          return [{ type: "Post", id: "LIST" }];
        }
      },
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetRecentPostsQuery,
  useLikePostMutation,
  useSavePostMutation,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetSavedPostsQuery,
  useGetLikedPostsQuery,
  useSearchPostsQuery,
  useGetPopularPostsQuery,
} = postApiSlice;
