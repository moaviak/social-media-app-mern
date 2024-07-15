import { Skeleton } from "@/components/ui/skeleton";

const MessageSkeleton = () => {
  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 dark py-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-[200px] rounded-bl-none rounded-r-xl rounded-tl-xl" />
          <Skeleton className="h-4 w-[100px] rounded-none" />
        </div>
      </div>
      <div className="flex items-center space-x-2 dark py-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-[200px] rounded-bl-none rounded-r-xl rounded-tl-xl" />
          <Skeleton className="h-4 w-[100px] rounded-none" />
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 dark py-2">
        <div className="space-y-2 flex items-end flex-col">
          <Skeleton className="h-12 w-[200px] rounded-br-none rounded-l-xl rounded-tr-xl" />
          <Skeleton className="h-4 w-[100px] rounded-none" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
};
export default MessageSkeleton;
