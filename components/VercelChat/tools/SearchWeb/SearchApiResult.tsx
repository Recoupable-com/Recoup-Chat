import React from "react";
import { parseSearchResults } from "@/lib/search/parseSearchResults";
import SearchResultItem from "./SearchResultItem";

export interface SearchApiResultType {
  content: {
    text: string;
    type: string;
  }[];
  isError: boolean;
}

const SearchApiResult = ({ result }: { result: SearchApiResultType }) => {
  if (result.isError) {
    return (
      <div className="py-3 px-4 bg-destructive/10 border border-destructive/30 rounded-lg">
        <p className="text-sm text-destructive font-medium">
          Error retrieving search results
        </p>
      </div>
    );
  }

  const text = result.content[0]?.text || "";
  const searchResults = parseSearchResults(text);

  if (searchResults.length === 0) {
    return (
      <div className="py-3 px-4">
        <p className="text-sm text-muted-foreground">No search results found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Reviewing sources · {searchResults.length}
      </p>
      
      <div className="space-y-1">
        {searchResults.map((item, index) => (
          <SearchResultItem 
            key={index} 
            result={item}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchApiResult;

