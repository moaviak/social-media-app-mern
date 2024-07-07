import { IComment } from "@/types";
import { apiSlice } from "./apiSlice";

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postComment: builder.mutation<
      { message: string } | { comment: IComment },
      { postId: string; text: string }
    >({
      query: ({ postId, text }) => ({
        url: `/api/posts/comments/${postId}`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (_result, _err, args) => [
        { type: "Comment", id: "LIST" },
        { type: "Post", id: args.postId },
      ],
    }),

    getPostComments: builder.query<
      { comments: IComment[] },
      { postId: string }
    >({
      query: ({ postId }) => ({
        url: `/api/posts/comments/${postId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result, _err, args) => {
        if (result?.comments && result.comments.length > 0) {
          return [
            { type: "Comment", id: "LIST" },
            ...result.comments.map((comment) => ({
              type: "Comment" as const,
              id: comment._id,
            })),
            { type: "Post", id: args.postId },
          ];
        } else {
          return [
            { type: "Comment", id: "LIST" },
            { type: "Post", id: args.postId },
          ];
        }
      },
    }),
    likeComment: builder.mutation<
      { comment: IComment },
      { commentId: string; isLiked: boolean }
    >({
      query: ({ commentId, isLiked }) => ({
        url: `/api/posts/comments/${commentId}`,
        method: "PUT",
        body: { isLiked },
      }),
      invalidatesTags: (result) => {
        if (result && result.comment) {
          return [
            { type: "Comment", id: result.comment._id },
            { type: "Post", id: result.comment.postId },
          ];
        } else {
          return [{ type: "Comment", id: "LIST" }];
        }
      },
    }),
  }),
});

export const {
  usePostCommentMutation,
  useGetPostCommentsQuery,
  useLikeCommentMutation,
} = commentApiSlice;
