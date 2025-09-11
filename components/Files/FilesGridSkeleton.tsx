"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function FilesGridSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2 p-1.5 md:grid-cols-6 lg:grid-cols-8">
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="rounded-md p-2 text-sm">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}


