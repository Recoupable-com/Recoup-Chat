import { Loader } from "lucide-react";

export function Sora2VideoSkeleton() {
  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex items-center gap-2">
        <Loader className="h-4 w-4 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">
          Generating video...
        </span>
      </div>
      <div className="w-full max-w-2xl aspect-video bg-muted animate-pulse rounded-lg" />
    </div>
  );
}
