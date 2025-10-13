/**
 * SearchResultItem.tsx
 * Displays a single search result as a clickable link with favicon and domain.
 * Used within SearchApiResult component for rendering individual results.
 */

import React from "react";
import { getDomain, getFaviconUrl, getFallbackFaviconUrl } from "@/utils/urlUtils";
import type { ParsedSearchResult } from "@/utils/search/parseSearchResults";

interface SearchResultItemProps {
  result: ParsedSearchResult;
  index: number;
}

/**
 * Renders a single search result with favicon, title, and domain.
 * Provides hover effects and opens links in a new tab.
 */
const SearchResultItem: React.FC<SearchResultItemProps> = ({ result, index }) => {
  const domain = getDomain(result.url);
  const faviconUrl = getFaviconUrl(domain);

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors group"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <img 
          src={faviconUrl} 
          alt="" 
          className="w-4 h-4 flex-shrink-0"
          onError={(e) => {
            e.currentTarget.src = getFallbackFaviconUrl();
          }}
        />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors">
          {result.title}
        </span>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
        {domain}
      </span>
    </a>
  );
};

export default SearchResultItem;

