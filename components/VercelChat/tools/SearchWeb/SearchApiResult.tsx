import React from "react";
import SearchResultItem from "./SearchResultItem";

export interface ParsedSearchResult {
  title: string;
  url: string;
  snippet?: string;
  date?: string;
  last_updated?: string;
}

export interface SearchApiResultType {
  results: ParsedSearchResult[];
  formatted: string;
}

const SearchApiResult = ({ result }: { result: SearchApiResultType }) => {
  if (!result) {
    return (
      <div className="py-3 px-4 bg-destructive/10 border border-destructive/30 rounded-lg">
        <p className="text-sm text-destructive font-medium">
          Error retrieving search results
        </p>
      </div>
    );
  }

  // Use results directly instead of parsing formatted string
  const searchResults: ParsedSearchResult[] = result.results;
  console.log("searchResults", searchResults);

  if (searchResults.length === 0) {
    return (
      <div className="py-3 px-4">
        <p className="text-sm text-muted-foreground">
          No search results found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Reviewing sources · {searchResults.length}
      </p>

      <div className="space-y-1">
        {searchResults.map((item, index) => (
          <SearchResultItem key={index} result={item} />
        ))}
      </div>
    </div>
  );
};

export default SearchApiResult;
