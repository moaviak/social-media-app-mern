import { useGetSavedPostsQuery } from "@/app/api/postApiSlice";
import PostSkeleton from "@/components/skeletons/PostSkeleton";
import GridPostList from "@/components/shared/GridPostList";

const Saved = () => {
  const { data: savedPosts, isLoading: isPostsLoading } = useGetSavedPostsQuery(
    {}
  );

  if (!savedPosts) return;

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {isPostsLoading ? (
        <ul className="grid-container">
          {[...Array(3)].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </ul>
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {!savedPosts ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savedPosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
