import React from "react";
import { Search } from "lucide-react";
import { Response } from "@/components/ai-elements/response";
import { SearchProgress } from "@/lib/tools/searchWeb/types";

/**
 * WebDeepResearchProgress component
 * Displays the various progress states of a deep research operation
 * - searching: Shows the research query being executed
 * - streaming: Displays accumulated analysis content as it streams
 * - complete: Returns null (final result handled elsewhere)
 */
interface WebDeepResearchProgressProps {
  progress: SearchProgress;
}

export const WebDeepResearchProgress: React.FC<WebDeepResearchProgressProps> = ({ progress }) => {
  // Searching state: Display the research query
  if (progress.status === 'searching') {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">Conducting deep research</p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 rounded-full">
          <Search className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{progress.query}</span>
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

