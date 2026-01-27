"use client";

import PulseToggleSkeleton from "@/components/Pulse/PulseToggleSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function PulseToolSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 max-w-sm shadow-sm">
      <div className="flex items-start space-x-3 mb-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-24" />
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <Skeleton className="h-4 w-32" />
        <PulseToggleSkeleton />
      </div>
    </div>
  );
}
