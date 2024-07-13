import MessageForm from "@/components/forms/MessageForm";
import Message from "@/components/shared/Message";
import {
  useGetAllChatsQuery,
  useGetAllMessagesQuery,
} from "@/app/api/chatApiSlice";
import Loader from "@/components/shared/Loader";
import { useParams } from "react-router-dom";

const ChatFrame = () => {
  const { id } = useParams();

  const { data: messages, isLoading } = useGetAllMessagesQuery({
    chatId: id || "",
  });

  const { chats } = useGetAllChatsQuery(null, {
    selectFromResult: ({ data }) => ({
      chats: data?.filter((chat) => chat._id === id),
    }),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!messages || !chats) {
    return;
  }

  return (
    <div className="chats_page-chat">
      <div className="chats_page-chat_header">
        <div className="flex gap-3 lg:gap-4 items-center">
          <img
            src={"/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="object-cover h-11 w-11 lg:h-14 lg:w-14"
          />
          <div>
            <p className="small-medium lg:base-medium">
              {chats[0].sender.name}
            </p>
            <p className="text-light-4 subtle-medium lg:small-medium">Online</p>
          </div>
        </div>
        <div className="flex gap-3 lg:gap-4 items-center">
          <img
            src="/assets/icons/phone.svg"
            alt="phone"
            className="h-6 w-6 lg:h-7 lg:w-7"
          />
          <img
            src="/assets/icons/videocamera.svg"
            alt="video"
            className="h-6 w-6 lg:h-7 lg:w-7"
          />
        </div>
      </div>
      <div className="w-full flex-1 overflow-y-scroll custom-scrollbar">
        {messages.map((message) => (
          <Message key={message._id} message={message} />
        ))}
      </div>
      <div className="flex-grow-0 flex-shrink-0 w-full py-3 lg:py-4">
        <MessageForm />
      </div>
    </div>
  );
};
export default ChatFrame;
