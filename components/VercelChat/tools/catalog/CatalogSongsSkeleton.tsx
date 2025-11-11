import { Loader } from "lucide-react";

export default function CatalogSongsSkeleton() {
  return (
    <div className="flex items-center gap-2 py-2 px-3 bg-primary/5 dark:bg-white/5 rounded-lg border  w-fit">
      <Loader className="h-4 w-4 animate-spin text-primary dark:text-white" />
      <span className="text-sm dark:text-muted-foreground">Processing catalog songs...</span>
    </div>
  );
}
