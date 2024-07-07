import { lazy, Suspense } from "react";
import useAuth from "@/hooks/useAuth";
import { useGetSavedPostsQuery } from "@/app/api/postApiSlice";
import { PulseLoader } from "react-spinners";

const GridPostList = lazy(() => import("@/components/shared/GridPostList"));

const Saved = () => {
  const currentUser = useAuth();

  const { data: savedPosts, isLoading } = useGetSavedPostsQuery({});

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

      {!currentUser || isLoading ? (
        <PulseLoader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {!savedPosts ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <Suspense fallback={<PulseLoader color="#fff" />}>
              <GridPostList posts={savedPosts} showStats={false} />
            </Suspense>
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
