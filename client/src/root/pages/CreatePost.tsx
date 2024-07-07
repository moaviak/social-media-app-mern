import { lazy, Suspense } from "react";
import { PulseLoader } from "react-spinners";

const PostForm = lazy(() => import("@/components/forms/PostForm"));

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>

        <Suspense fallback={<PulseLoader color="#fff" />}>
          <PostForm action="Create" />
        </Suspense>
      </div>
    </div>
  );
};

export default CreatePost;
