import { Skeleton } from "../ui/skeleton";

const CommentSkeleton = () => {
  return (
    <div className="flex gap-2 dark">
      <Skeleton className="h-9 w-9 rounded-full" />

      <div className="space-y-1">
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[120px]" />
      </div>
    </div>
  );
};
export default CommentSkeleton;
