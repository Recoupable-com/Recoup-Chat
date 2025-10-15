"use client";

import { Globe, Loader, Check } from "lucide-react";
import { getPlatformInfo } from "@/lib/browser/detectPlatform";
import { useState, useEffect } from "react";

interface BrowserToolSkeletonProps {
  toolName: string;
  url?: string;
}

interface ProgressStep {
  label: string;
  completed: boolean;
  active: boolean;
}

export function BrowserToolSkeleton({ toolName, url }: BrowserToolSkeletonProps) {
  const platform = getPlatformInfo(url);
  const [steps, setSteps] = useState<ProgressStep[]>(getInitialSteps(toolName));

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    const initialSteps = getInitialSteps(toolName);

    initialSteps.forEach((_, index) => {
      const delay = index * 2000;
      const timeout = setTimeout(() => {
        setSteps(prev => prev.map((step, i) => ({
          ...step,
          completed: i < index,
          active: i === index,
        })));
      }, delay);
      intervals.push(timeout);
    });

    return () => intervals.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl my-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 shadow-sm">
        {/* LEFT: Progress Steps */}
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
          
          {/* LIVE SESSION CALLOUT for agent */}
          {toolName === "browser_agent" && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-lg">🎥</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Watch AI Control the Browser Live!
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    A live session link will appear above. Click it to watch the agent work in real-time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex flex-col gap-2 mt-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                {step.completed ? (
                  <Check className="h-3 w-3 text-gray-900 dark:text-gray-100 flex-shrink-0" />
                ) : step.active ? (
                  <Loader className="h-3 w-3 animate-spin text-gray-900 dark:text-gray-100 flex-shrink-0" />
                ) : (
                  <div className="h-3 w-3 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                )}
                <span className={`text-xs ${
                  step.completed 
                    ? 'text-gray-900 dark:text-gray-100' 
                    : step.active 
                    ? 'text-gray-900 dark:text-gray-100 font-medium' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
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

function getInitialSteps(toolName: string): ProgressStep[] {
  if (toolName === "browser_extract") {
    return [
      { label: "Initializing browser session", completed: false, active: true },
      { label: "Navigating to page", completed: false, active: false },
      { label: "Waiting for page to load", completed: false, active: false },
      { label: "Extracting data from page", completed: false, active: false },
      { label: "Processing results", completed: false, active: false },
    ];
  } else if (toolName === "browser_act") {
    return [
      { label: "Initializing browser session", completed: false, active: true },
      { label: "Navigating to page", completed: false, active: false },
      { label: "Locating element", completed: false, active: false },
      { label: "Performing action", completed: false, active: false },
      { label: "Capturing screenshot", completed: false, active: false },
    ];
  } else if (toolName === "browser_observe") {
    return [
      { label: "Initializing browser session", completed: false, active: true },
      { label: "Navigating to page", completed: false, active: false },
      { label: "Analyzing page structure", completed: false, active: false },
      { label: "Identifying interactive elements", completed: false, active: false },
    ];
  } else if (toolName === "browser_agent") {
    return [
      { label: "Initializing autonomous agent", completed: false, active: true },
      { label: "Planning workflow steps", completed: false, active: false },
      { label: "Navigating and interacting", completed: false, active: false },
      { label: "Extracting target data", completed: false, active: false },
      { label: "Completing workflow", completed: false, active: false },
    ];
  }
  
  return [
    { label: "Starting browser automation", completed: false, active: true },
    { label: "Processing request", completed: false, active: false },
  ];
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
