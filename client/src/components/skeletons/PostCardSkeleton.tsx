import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="post-card dark">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </div>

      <Skeleton className="h-8 w-full my-6" />

      <Skeleton className="w-full h-96" />
    </div>
  );
};
export default PostSkeleton;
