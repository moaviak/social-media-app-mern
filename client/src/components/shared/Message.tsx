import useAuth from "@/hooks/useAuth";
import { formatDateToTodayTime } from "@/lib/utils";
import { IMessage } from "@/types";

const Message = ({ message }: { message: IMessage }) => {
  const user = useAuth();

  if (user.id === message.sender._id) {
    return <SentMessage message={message} />;
  }

  return <ReceivedMessage message={message} />;
};

const ReceivedMessage = ({ message }: { message: IMessage }) => {
  return (
    <div className="flex gap-2 items-center">
      <img
        className="size-8 rounded-full object-cover"
        src={
          message.sender.profilePicture ||
          "/assets/icons/profile-placeholder.svg"
        }
        alt="avatar"
      />
      <div className="flex flex-col items-start max-w-[70%] gap-2 my-2">
        <div className="mr-auto flex max-w-full flex-col gap-2 rounded-r-xl rounded-tl-xl bg-dark-4 py-3 px-4 lg:p-4 text-white">
          <div className="text-sm">{message.content}</div>
        </div>
        <span className="subtle-regular lg:text-xs">
          {formatDateToTodayTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

const SentMessage = ({ message }: { message: IMessage }) => {
  return (
    <div className="flex justify-end gap-2 items-center">
      <div className="flex flex-col items-end max-w-[70%] gap-2 my-2">
        <div className="ml-auto flex max-w-full flex-col gap-2 rounded-l-xl rounded-tr-xl bg-primary-500 py-3 px-4 lg:p-4 text-white">
          <div className="text-sm">{message.content}</div>
        </div>
        <span className="subtle-regular lg:text-xs">
          {formatDateToTodayTime(message.createdAt)}
        </span>
      </div>
      <img
        className="size-8 rounded-full object-cover"
        src={
          message.sender.profilePicture ||
          "/assets/icons/profile-placeholder.svg"
        }
        alt="avatar"
      />
    </div>
  );
};
export default Message;
