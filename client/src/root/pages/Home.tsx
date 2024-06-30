import { useGetRecentPostsQuery } from "@/app/api/postApiSlice";
import { useGetTopCreatorsQuery } from "@/app/api/userApiSlice";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { IPost } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { PulseLoader } from "react-spinners";

const Home = () => {
  const { ref, inView } = useInView();
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);
  const postSet = useRef(new Set<string>());

  const {
    data,
    isLoading: isPostLoading,
    isError: isErrorPosts,
    isFetching,
  } = useGetRecentPostsQuery({ page });

  const {
    data: creators,
    isLoading: isCreatorLoading,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {isPostLoading && !posts ? (
            <PulseLoader color="#fff" />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts.map((post: IPost) => (
                <li key={post._id} className="flex justify-center w-full">
                  <PostCard post={post} />
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
        {isCreatorLoading && !creators ? (
          <PulseLoader color="#fff" />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.map((creator) => (
              <li key={creator?._id}>
                <UserCard user={creator} handleFollow={handleFollow} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
