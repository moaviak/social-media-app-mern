import { lazy, Suspense } from "react";
import { useGetLikedPostsQuery } from "@/app/api/postApiSlice";
import { IUser } from "@/types";
import { PulseLoader } from "react-spinners";

// Lazy load the GridPostList component
const GridPostList = lazy(() => import("@/components/shared/GridPostList"));

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

      <Suspense fallback={<PulseLoader color="#fff" />}>
        <GridPostList posts={likedPosts} showStats={false} />
      </Suspense>
    </>
  );
};

export default LikedPosts;
