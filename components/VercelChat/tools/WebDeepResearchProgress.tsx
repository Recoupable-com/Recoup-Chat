import React, { useState, useEffect } from "react";
import { Response } from "@/components/ai-elements/response";
import { SearchProgress } from "@/lib/tools/searchWeb/types";

/**
 * WebDeepResearchProgress component
 * Displays the various progress states of a deep research operation
 * - searching: Shows query with elapsed time and progress indicator
 * - streaming: Displays accumulated analysis content as it streams
 * - complete: Returns null (final result handled elsewhere)
 */
interface WebDeepResearchProgressProps {
  progress: SearchProgress;
}

const ACTIVITY_MESSAGES = [
  "gathering sources and creating your report",
  "searching hundreds of sources",
  "analyzing expert insights",
  "synthesizing research data",
  "compiling comprehensive analysis",
];

export const WebDeepResearchProgress: React.FC<WebDeepResearchProgressProps> = ({ progress }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const isSearching = progress.status === 'searching';

  // Timer for elapsed time - only depends on isSearching boolean
  useEffect(() => {
    if (!isSearching) {
      setElapsedSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isSearching]);

  // Rotate activity messages every 5 seconds
  useEffect(() => {
    if (!isSearching) {
      setMessageIndex(0);
      return;
    }

    const messageTimer = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % ACTIVITY_MESSAGES.length);
    }, 5000);
    
    return () => clearInterval(messageTimer);
  }, [isSearching]);

  // Searching state: Display progress card with countdown
  if (progress.status === 'searching') {
    const TOTAL_SECONDS = 180; // 3 minutes
    const remainingSeconds = Math.max(0, TOTAL_SECONDS - elapsedSeconds);
    const progressPercent = (elapsedSeconds / TOTAL_SECONDS) * 100;
    
    const formatTimeRemaining = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (mins === 0) return `${secs} seconds`;
      if (secs === 0) return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
      return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    };

    return (
      <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4 bg-gray-50 dark:bg-zinc-900/50">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 capitalize transition-opacity duration-300">
            {ACTIVITY_MESSAGES[messageIndex]}
          </span>
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
            {formatTimeRemaining(remainingSeconds)}
          </span>
        </div>

        <div className="relative h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>
    );
  }

  // Reviewing state: Display sources found
  if (progress.status === 'reviewing') {
    const searchResults = progress.searchResults || [];
    const getDomain = (url: string) => {
      try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
      } catch {
        return url;
      }
    };

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

  // Complete state: Don't show anything (final result handled elsewhere)
  if (progress.status === 'complete') {
    return null;
  }

  // Fallback for unknown status
  return null;
};

export default WebDeepResearchProgress;
