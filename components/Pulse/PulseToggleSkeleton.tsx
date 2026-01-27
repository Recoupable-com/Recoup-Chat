"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PulseToggleSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-14" />
      <Skeleton className="h-5 w-9 rounded-full" />
    </div>
  );
}
