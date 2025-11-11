import React from "react";
import { Youtube } from "lucide-react";

export function YouTubeAccessSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-4 rounded-lg bg-muted border border-border my-2 max-w-md animate-pulse">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Youtube className="h-5 w-5 text-muted-foreground dark:text-muted-foreground" />
        <div className="h-4 bg-muted  rounded w-32"></div>
      </div>

      {/* Channel Info Skeleton */}
      <div className="flex items-start space-x-3">
        {/* Avatar Skeleton */}
        <div className="h-12 w-12 rounded-full bg-muted  shrink-0"></div>

        {/* Channel Details Skeleton */}
        <div className="flex-grow min-w-0 space-y-2">
          <div className="h-4 bg-muted  rounded w-24"></div>
          <div className="h-3 bg-muted  rounded w-16"></div>
        </div>
      </div>

      {/* Statistics Skeleton */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
        <div className="text-center space-y-1">
          <div className="h-4 bg-muted  rounded w-8 mx-auto"></div>
          <div className="h-3 bg-muted  rounded w-12 mx-auto"></div>
        </div>
        <div className="text-center space-y-1">
          <div className="h-4 bg-muted  rounded w-8 mx-auto"></div>
          <div className="h-3 bg-muted  rounded w-10 mx-auto"></div>
        </div>
        <div className="text-center space-y-1">
          <div className="h-4 bg-muted  rounded w-8 mx-auto"></div>
          <div className="h-3 bg-muted  rounded w-8 mx-auto"></div>
        </div>
      </div>

      {/* Date Skeleton */}
      <div className="h-3 bg-muted  rounded w-20"></div>
    </div>
  );
}

export default YouTubeAccessSkeleton; 