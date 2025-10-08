import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const UserProfileButtonSkeleton = () => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start items-center gap-2 h-auto py-1 pl-1 pr-2 rounded-xl border border-transparent hover:border-muted-foreground/20 min-h-[50px]"
      type="button"
      disabled
      aria-label="Loading user profile"
    >
      <Skeleton className="h-8 w-8 md:h-9 md:w-9 rounded-full ring-2 ring-muted-foreground/20" />
      
      <div className="flex-1 min-w-0 text-left">
        <Skeleton className="h-4 md:h-5 w-24 md:w-28 mb-1" />
        <Skeleton className="h-3 w-20 md:w-24" />
      </div>
      
      <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 p-0">
        <Skeleton className="h-4 w-4 shrink-0 ml-auto" />
      </div>
    </Button>
  );
};

export default UserProfileButtonSkeleton;
