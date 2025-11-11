"use client";

import { Globe, Loader, Check } from "lucide-react";
import { getPlatformInfo } from "@/lib/browser/getPlatformInfo";
import { getInitialSteps, type ProgressStep } from "@/lib/browser/getInitialSteps";
import { getTaskDescription } from "@/lib/browser/getTaskDescription";
import { useState, useEffect } from "react";

interface BrowserToolSkeletonProps {
  toolName: string;
  url?: string;
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border rounded-xl p-4 bg-card shadow-sm">
        {/* LEFT: Progress Steps */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{platform.emoji}</span>
            <span className="text-sm font-medium text-foreground capitalize">
              {platform.name}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
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
                  <Check className="h-3 w-3 text-foreground flex-shrink-0" />
                ) : step.active ? (
                  <Loader className="h-3 w-3 animate-spin text-foreground flex-shrink-0" />
                ) : (
                  <div className="h-3 w-3 rounded-full border-2 border-border flex-shrink-0" />
                )}
                <span className={`text-xs ${
                  step.completed 
                    ? 'text-foreground' 
                    : step.active 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Browser Preview */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Browser View
          </span>
          <div className="border border-border rounded-lg bg-muted aspect-[4/3] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Globe className="h-12 w-12 animate-pulse" />
              <span className="text-xs">Loading {platform.name}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
