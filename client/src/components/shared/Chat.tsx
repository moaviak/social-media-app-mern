import { IChat } from "@/types";
import { useParams } from "react-router-dom";

const Chat = ({ chat }: { chat: IChat }) => {
  const { "*": id } = useParams();

  const isActive = chat._id === id;

  return (
    <li
      className={`w-full flex gap-3 items-center py-2 lg:py-3 px-2 lg:px-4 ${
        isActive && "bg-dark-4"
      }`}
    >
      <img
        src={
          chat.sender.profilePicture || "/assets/icons/profile-placeholder.svg"
        }
        alt="profile"
        className="object-cover h-12 w-12 md:h-10 md:w-10 lg:h-14 lg:w-14 rounded-full"
      />
      <div>
        <p className="base-medium md:small-medium lg:base-medium">
          {chat.sender.name}
        </p>
        <p className="text-light-4 small-medium md:subtle-medium lg:small-medium">
          @{chat.sender.username}
        </p>
      </div>
    </li>
  );
};
export default Chat;
