import { Loader2 } from "lucide-react";

export function ImageSkeleton() {
  return (
    <div className="w-full max-w-md my-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100 dark:bg-dark-bg-secondary animate-pulse flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-gray-400 dark:text-gray-600 animate-spin" />
      </div>
      <div className="mt-4 text-left">
        <p className="text-sm text-muted-foreground">Generating image...</p>
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          This may take a moment. The image will be revealed when complete.
        </div>
      </div>
    </div>
  );
}
