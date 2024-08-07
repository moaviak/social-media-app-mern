import { useSocketContext } from "@/context/SocketContext";
import { IChat, IUser } from "@/types";
import { useParams } from "react-router-dom";

type ChatPropsType = {
  chat?: IChat;
  user?: IUser;
};

const Chat = ({ chat, user }: ChatPropsType) => {
  const { "*": id } = useParams();
  const isActive = chat?.sender._id === id || user?._id === id;
  const { onlineUsers } = useSocketContext();

  const isOnline = onlineUsers.includes(chat?.sender._id || user?._id || "");

  return (
    <li
      className={`w-full flex items-center justify-between py-2 lg:py-3 px-2 lg:px-4 ${
        isActive && "bg-dark-4"
      }`}
    >
      <div className="flex gap-3 items-center">
        <img
          src={
            chat?.sender.profilePicture ||
            user?.profilePicture ||
            "/assets/icons/profile-placeholder.svg"
          }
          alt="profile"
          className="object-cover h-12 w-12 md:h-10 md:w-10 lg:h-14 lg:w-14 rounded-full"
        />
        <div>
          <p className="base-medium md:small-medium lg:base-medium">
            {chat?.sender.name || user?.name}
          </p>
          <p className="text-light-4 small-medium md:subtle-medium lg:small-medium">
            @{chat?.sender.username || user?.username}
          </p>
        </div>
      </div>
      <span
        className={`rounded-full h-3 w-3 ${
          isOnline ? "bg-green-500" : "bg-dark-3"
        } `}
      />
    </li>
  );
};
export default Chat;
