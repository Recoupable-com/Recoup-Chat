import { Loader } from "lucide-react";

export default function InsertCatalogSongsSkeleton() {
  return (
    <div className="flex items-center gap-2 py-2 px-3 bg-primary/5 rounded-lg border w-fit">
      <Loader className="h-4 w-4 animate-spin text-primary" />
      <span className="text-sm">Processing catalog songs...</span>
    </div>
  );
}
