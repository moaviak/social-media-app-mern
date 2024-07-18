import { Skeleton } from "../ui/skeleton";

const UserSkeleton = () => {
  return (
    <div className="user-card dark">
      <Skeleton className="h-14 w-14 rounded-full" />

      <div className="flex-center flex-col gap-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-8 w-28 rounded-md" />
    </div>
  );
};
export default UserSkeleton;
