import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useGetPostByIdQuery } from "@/app/api/postApiSlice";

const PostForm = lazy(() => import("@/components/forms/PostForm"));

const EditPost = () => {
  const { id } = useParams();

  const { data: post, isLoading, isError } = useGetPostByIdQuery(id || "");

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <PulseLoader color="#fff" />
      </div>
    );

  if (isError) return null;

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        <Suspense fallback={<PulseLoader color="#fff" />}>
          <PostForm action="Update" post={post} />
        </Suspense>
      </div>
    </div>
  );
};

export default EditPost;
