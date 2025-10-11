import React from "react";
import { Search, Loader } from "lucide-react";
import { Response } from "@/components/ai-elements/response";
import { SearchProgress } from "@/lib/tools/searchWeb/types";

/**
 * SearchWebProgress component
 * Displays the various progress states of a web search operation
 * - searching: Shows the search query being executed
 * - reviewing: Displays the list of sources being reviewed
 * - streaming: Shows accumulated content as it streams in
 * - complete: Returns null (final result handled by SearchWebResult)
 */
interface SearchWebProgressProps {
  progress: SearchProgress;
}

/**
 * Helper function to extract domain from URL
 */
const getDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

export const SearchWebProgress: React.FC<SearchWebProgressProps> = ({ progress }) => {
  // Searching state: Display the query being searched
  if (progress.status === 'searching') {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">Searching</p>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 rounded-full">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{progress.query}</span>
          </div>
        </div>
      </div>
    );
  }

  // Reviewing state: Display list of sources being reviewed
  if (progress.status === 'reviewing') {
    const searchResults = progress.searchResults || [];

    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Reviewing sources · {searchResults.length}
        </p>
        
        <div className="border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950">
          {searchResults.map((item, index) => {
            const domain = getDomain(item.url);
            const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
            
            return (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <img 
                    src={favicon} 
                    alt="" 
                    className="w-4 h-4 flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
                    }}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {domain}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  // Streaming state: Display accumulated content as it streams
  if (progress.status === 'streaming') {
    return (
      <div className="flex flex-col gap-3 py-3 px-4 bg-primary/5 rounded-lg border">
        <div className="flex items-center gap-2">
          <Loader className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm font-medium">{progress.message}</span>
        </div>
        {progress.accumulatedContent && (
          <Response className="w-full">{progress.accumulatedContent}</Response>
        )}
      </div>
    );
  }

  // Complete state: Don't show anything (final result handled by SearchWebResult)
  if (progress.status === 'complete') {
    return null;
  }

  // Fallback for unknown status
  return null;
};

export default SearchWebProgress;

