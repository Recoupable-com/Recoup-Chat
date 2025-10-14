/**
 * WebDeepResearchProgress.tsx
 * Displays the various progress states of a deep research operation.
 * Single responsibility: Orchestrate progress state display for deep research.
 */

import React from "react";
import { Response } from "@/components/ai-elements/response";
import { SearchProgress } from "@/lib/tools/searchWeb/types";
import { useResearchTimer } from "@/hooks/useResearchTimer";
import { formatTimeRemaining, calculateProgressPercent } from "@/utils/timeFormatting";
import SearchResultItem from "./SearchResultItem";

interface WebDeepResearchProgressProps {
  progress: SearchProgress;
}

const TOTAL_SECONDS = 180; // 3 minutes

export const WebDeepResearchProgress: React.FC<WebDeepResearchProgressProps> = ({ progress }) => {
  const isSearching = progress.status === 'searching';
  const { elapsedSeconds, messageIndex, activityMessages } = useResearchTimer(isSearching);

  // Searching state: Display progress card with countdown
  if (progress.status === 'searching') {
    const remainingSeconds = Math.max(0, TOTAL_SECONDS - elapsedSeconds);
    const progressPercent = calculateProgressPercent(elapsedSeconds, TOTAL_SECONDS);

    return (
      <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4 bg-gray-50 dark:bg-zinc-900/50">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 capitalize transition-opacity duration-300">
            {activityMessages[messageIndex]}
          </span>
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
            {formatTimeRemaining(remainingSeconds)}
          </span>
        </div>

        <div className="relative h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    );
  }

  // Reviewing state: Display sources found
  if (progress.status === 'reviewing') {
    const searchResults = progress.searchResults || [];

    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Reviewing sources · {searchResults.length}
        </p>
        
        <div className="border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950">
          {searchResults.map((item, index) => (
            <SearchResultItem 
              key={index} 
              result={item}
            />
          ))}
        </div>
      </div>
    );
  }

  // Streaming state: Display accumulated analysis content
  if (progress.status === 'streaming') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">Analyzing sources</p>
        <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-950">
          <Response className="w-full">{progress.accumulatedContent}</Response>
        </div>
      </div>
    );
  }

  // Complete state: Display final research summary with all content and citations
  if (progress.status === 'complete') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">Research complete</p>
        <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-950">
          <Response className="w-full">{progress.accumulatedContent}</Response>
        </div>
      </div>
    );
  }

  // Fallback for unknown status
  return null;
};

export default WebDeepResearchProgress;
