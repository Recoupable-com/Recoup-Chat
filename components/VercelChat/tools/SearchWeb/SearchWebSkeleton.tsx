import React from "react";
import { Search } from "lucide-react";

const SearchWebSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Searching</p>
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted dark:bg-zinc-900 rounded-full">
          <Search className="h-3.5 w-3.5 text-muted-foreground animate-pulse" />
          <div className="h-3.5 bg-muted dark:bg-zinc-700 rounded w-48 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SearchWebSkeleton; 