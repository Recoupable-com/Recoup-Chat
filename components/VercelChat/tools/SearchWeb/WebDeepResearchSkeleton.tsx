import React from "react";
import { Search } from "lucide-react";

const WebDeepResearchSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Conducting deep research</p>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 rounded-full">
        <Search className="h-3.5 w-3.5 text-gray-400 animate-pulse" />
        <div className="h-3.5 bg-gray-200 dark:bg-zinc-700 rounded w-64 animate-pulse" />
      </div>
    </div>
  );
};

export default WebDeepResearchSkeleton;
