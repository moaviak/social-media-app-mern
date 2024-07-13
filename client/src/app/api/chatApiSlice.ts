import { IChat, IMessage } from "@/types";
import { apiSlice } from "./apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllChats: builder.query<IChat[], null>({
      query: () => ({
        url: `/api/chats`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result) => {
        if (result && result.length > 0) {
          return [
            { type: "Chat", id: "LIST" },
            ...result.map((chat) => ({ type: "Chat" as const, id: chat._id })),
          ];
        } else {
          return [{ type: "Chat", id: "LIST" }];
        }
      },
    }),
    getAllMessages: builder.query<IMessage[], { chatId: string }>({
      query: ({ chatId }) => ({
        url: `/api/chats/${chatId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result, _err, args) => {
        if (result) {
          return [
            { type: "Message", id: "LIST" },
            { type: "Chat", id: args.chatId },
            ...result.map((message) => ({
              type: "Message" as const,
              id: message._id,
            })),
          ];
        } else {
          return [
            { type: "Message", id: "LIST" },
            { type: "Chat", id: args.chatId },
          ];
        }
      },
    }),
    sendMessage: builder.mutation({
      query: ({ receiverId, content }) => ({
        url: `/api/chats/${receiverId}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: [{ type: "Message", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllChatsQuery,
  useGetAllMessagesQuery,
  useSendMessageMutation,
} = chatApiSlice;
