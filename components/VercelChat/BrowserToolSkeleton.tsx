"use client";

import { Globe, Loader } from "lucide-react";
import { getPlatformInfo } from "@/lib/browser/detectPlatform";

interface BrowserToolSkeletonProps {
  toolName: string;
  url?: string;
}

/**
 * Minimal browser tool skeleton
 * Two-column layout: progress on left, browser preview on right
 */
export function BrowserToolSkeleton({ toolName, url }: BrowserToolSkeletonProps) {
  const platform = getPlatformInfo(url);

  return (
    <div className="max-w-4xl my-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 shadow-sm">
        {/* LEFT: Progress */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{platform.emoji}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
              {platform.name}
            </span>
          </div>
          
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {getTaskDescription(toolName, platform.name, url)}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Loader className="h-3 w-3 animate-spin text-blue-500" />
            <span className="text-xs text-blue-600 dark:text-blue-400">Working...</span>
          </div>
        </div>

        {/* RIGHT: Browser Preview */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Browser View
          </span>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 aspect-[4/3] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <Globe className="h-12 w-12 animate-pulse" />
              <span className="text-xs">Loading {platform.name}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTaskDescription(toolName: string, platformName: string, url?: string): string {
  const accountName = url?.split("/").pop()?.replace("@", "") || "";
  
  if (toolName === "browser_extract") {
    return `Extract the current follower count for the ${platformName} account ${accountName ? "@" + accountName : ""}.`;
  } else if (toolName === "browser_act") {
    return `Perform action on ${platformName}.`;
  } else if (toolName === "browser_observe") {
    return `Analyze available actions on ${platformName}.`;
  } else if (toolName === "browser_agent") {
    return `Autonomously navigate and extract data from ${platformName}.`;
  }
  
  return `Processing ${platformName}...`;
}
