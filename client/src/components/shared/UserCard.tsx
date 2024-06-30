import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { IUser } from "@/types";
import { useCallback, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { debounce } from "lodash";
import { useFollowUserMutation } from "@/app/api/userApiSlice";
type UserCardProps = {
  user: IUser;
  handleFollow?: (userId: string, isFollowing: boolean) => void;
};

const UserCard = ({ user, handleFollow }: UserCardProps) => {
  const navigate = useNavigate();

  const currentUser = useAuth();
  const [isFollowing, setIsFollowing] = useState(
    () =>
      user._id === currentUser?.id ||
      user.followers.includes(currentUser?.id || "")
  );

  const [followUser] = useFollowUserMutation();

  function onFollow(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    if (user._id === currentUser?.id) return;

    e.stopPropagation();

    const newIsfollowing = !isFollowing;
    setIsFollowing(newIsfollowing);

    debouncedFollow(user._id, newIsfollowing);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFollow = useCallback(
    debounce(async (userId: string, isFollowing: boolean) => {
      await followUser({ userId, isFollowing });
      if (handleFollow) handleFollow(userId, isFollowing);
    }, 300),
    []
  );

  return (
    <div onClick={() => navigate(`/profile/${user._id}`)} className="user-card">
      <img
        src={user.profilePicture || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        className={`shad-button_${isFollowing ? "dark_4" : "primary"} px-5`}
        onClick={(e) => onFollow(e)}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
};

export default UserCard;
