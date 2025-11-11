import { Skeleton } from "@/components/ui/skeleton";

const RecentChatSkeleton = () => {
  return (
    <div className="w-full flex flex-col bg-white dark:bg-dark-bg-secondary gap-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
};

export default RecentChatSkeleton;
