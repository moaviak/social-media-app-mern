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
  }),
});

export const { usePostCommentMutation } = commentApiSlice;
