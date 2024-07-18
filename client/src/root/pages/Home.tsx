import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { PulseLoader } from "react-spinners";
import { useGetRecentPostsQuery } from "@/app/api/postApiSlice";
import { useGetTopCreatorsQuery } from "@/app/api/userApiSlice";
import { IPost } from "@/types";
import PostCardSkeleton from "@/components/skeletons/PostCardSkeleton";
import UserSkeleton from "@/components/skeletons/UserSkeleton";

// Lazy load components
const PostCard = lazy(() => import("@/components/shared/PostCard"));
const UserCard = lazy(() => import("@/components/shared/UserCard"));

const Home = () => {
  const { ref, inView } = useInView();
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);
  const postSet = useRef(new Set<string>());

  const {
    data,
    isLoading: isPostsLoading,
    isError: isErrorPosts,
    isFetching,
  } = useGetRecentPostsQuery({ page });

  const {
    data: creators,
    isLoading: isCreatorsLoading,
    isError: isErrorCreators,
  } = useGetTopCreatorsQuery(undefined);

  useEffect(() => {
    if (data) {
      const newPosts = data.recentPosts.filter(
        (post: IPost) => !postSet.current.has(post._id)
      );
      newPosts.forEach((post) => postSet.current.add(post._id));
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    }
  }, [data]);

  useEffect(() => {
    if (isFetching) return;

    if (inView && data?.nextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [data?.nextPage, inView, isFetching]);

  const handleFollow = async (userId: string, isFollowing: boolean) => {
    if (!isFollowing) {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => {
          if (post.creator._id === userId) {
            postSet.current.delete(post._id);
            return false;
          }
          return true;
        })
      );
    }
  };

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostsLoading && !posts ? (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {[...Array(3)].map((i) => (
                <PostCardSkeleton key={i} />
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts.map((post: IPost) => (
                <li key={post._id} className="flex justify-center w-full">
                  <Suspense fallback={<PostCardSkeleton />}>
                    <PostCard post={post} />
                  </Suspense>
                </li>
              ))}
            </ul>
          )}
        </div>
        {data?.nextPage && (
          <div ref={ref} className="mt-10">
            <PulseLoader color="#fff" />
          </div>
        )}
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isCreatorsLoading && !creators ? (
          <ul className="flex flex-col flex-1 gap-9 w-full ">
            {[...Array(10)].map((i) => (
              <UserSkeleton key={i} />
            ))}
          </ul>
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.map((creator) => (
              <li key={creator?._id}>
                <Suspense fallback={<UserSkeleton />}>
                  <UserCard user={creator} handleFollow={handleFollow} />
                </Suspense>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
