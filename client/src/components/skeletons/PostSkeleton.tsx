import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="relative min-w-80 h-80 dark rounded-lg">
      <Skeleton className="h-full w-full rounded-lg" />

      <div className="grid-post_user">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
};
export default PostSkeleton;
