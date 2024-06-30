import { IUser } from "@/types";
import UserCard from "./UserCard";

type UsersListProps = {
  title: "Followers" | "Following" | "Search Results";
  users: IUser[];
};

const UsersList = ({ title, users }: UsersListProps) => {
  return (
    <div className="p-8">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All {title}</h2>
        <ul className="user-grid">
          {users?.map((user) => (
            <li key={user?._id} className="flex-1 min-w-[200px] w-full  ">
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default UsersList;
