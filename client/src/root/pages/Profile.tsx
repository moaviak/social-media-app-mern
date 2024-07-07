import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { Button } from "@/components/ui";
import { LikedPosts } from "@/root/pages";
import { GridPostList } from "@/components/shared";
import useAuth from "@/hooks/useAuth";
import {
  useFollowUserMutation,
  useGetUserByIdQuery,
  useGetUserPostsQuery,
} from "@/app/api/userApiSlice";
import { PulseLoader } from "react-spinners";
import { useCallback, useState } from "react";
import { debounce } from "lodash";

interface StatBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StatBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const user = useAuth();
  const { pathname } = useLocation();

  const { data: currentUser } = useGetUserByIdQuery(id || "");
  const { data, isLoading } = useGetUserPostsQuery(id || "");

  const [isFollowing, setIsFollowing] = useState(
    () =>
      user?.id === currentUser?._id ||
      currentUser?.followers.includes(user?.id || "")
  );

  const [followUser] = useFollowUserMutation();

  function onFollow(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    if (user?.id === currentUser?._id) return;

    e.stopPropagation();

    const newIsfollowing = !isFollowing;
    setIsFollowing(newIsfollowing);

    debouncedFollow(currentUser?._id || "", newIsfollowing);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFollow = useCallback(
    debounce(async (userId: string, isFollowing: boolean) => {
      await followUser({ userId, isFollowing });
    }, 300),
    []
  );

  if (!currentUser || !user || isLoading)
    return (
      <div className="flex-center w-full h-full">
        <PulseLoader />
      </div>
    );

  if (!data) return;

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.profilePicture ||
              "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full object-cover"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock
                value={currentUser.createdPosts.length}
                label="Posts"
              />
              <Link to={`/users/${id}`}>
                <StatBlock
                  value={currentUser.followers.length}
                  label="Followers"
                />
              </Link>
              <Link to={`/users/${id}/following`}>
                <StatBlock
                  value={currentUser.following.length}
                  label="Following"
                />
              </Link>
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser._id && "hidden"}`}>
              <Link
                to={`/update-profile`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser._id && "hidden"
                }`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              <Button
                type="button"
                className={`shad-button_${
                  isFollowing ? "dark_4" : "primary"
                } px-8`}
                onClick={(e) => onFollow(e)}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser._id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route index element={<GridPostList posts={data} showUser={false} />} />
        {currentUser._id === user.id && (
          <Route
            path="/liked-posts"
            element={<LikedPosts currentUser={currentUser} />}
          />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
