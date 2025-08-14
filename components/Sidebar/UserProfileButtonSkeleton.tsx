import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const UserProfileButtonSkeleton = () => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start items-center gap-2 h-auto py-1 pl-1 pr-2 rounded-xl border border-transparent hover:border-muted-foreground/20"
      type="button"
      disabled
      aria-label="Loading user profile"
    >
      {/* Avatar skeleton */}
      <Skeleton className="h-8 w-8 md:h-9 md:w-9 rounded-full ring-2 ring-muted-foreground/20" />
      
      {/* Text content skeleton */}
      <div className="flex-1 min-w-0 text-left">
        {/* Name skeleton */}
        <Skeleton className="h-4 md:h-5 w-24 md:w-28 mb-1" />
        {/* Email skeleton */}
        <Skeleton className="h-3 w-20 md:w-24" />
      </div>
      
      {/* Chevron button skeleton */}
      <Button variant="ghost" className="p-0" disabled>
        <Skeleton className="h-4 w-4 shrink-0 text-muted-foreground ml-auto opacity-50" />
      </Button>
    </Button>
  );
};

export default UserProfileButtonSkeleton;
