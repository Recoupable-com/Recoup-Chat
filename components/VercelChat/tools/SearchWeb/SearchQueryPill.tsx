import React from "react";
import { Search } from "lucide-react";

interface SearchQueryPillProps {
  query: string;
}

const SearchQueryPill: React.FC<SearchQueryPillProps> = ({ query }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted dark:bg-zinc-900 rounded-full">
      <Search className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-sm text-muted-foreground dark:text-muted-foreground">{query}</span>
    </div>
  );
};

export default SearchQueryPill;

