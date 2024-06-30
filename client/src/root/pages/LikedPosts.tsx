import { useGetLikedPostsQuery } from "@/app/api/postApiSlice";
import { GridPostList } from "@/components/shared";
import { IUser } from "@/types";
import { PulseLoader } from "react-spinners";

const LikedPosts = ({ currentUser }: { currentUser: IUser }) => {
  const { data: likedPosts } = useGetLikedPostsQuery({});

  if (!currentUser || !likedPosts)
    return (
      <div className="flex-center w-full h-full">
        <PulseLoader color="#fff" />
      </div>
    );

  return (
    <>
      {!likedPosts.length && <p className="text-light-4">No liked posts</p>}

      <GridPostList posts={likedPosts} showStats={false} />
    </>
  );
};

export default LikedPosts;
