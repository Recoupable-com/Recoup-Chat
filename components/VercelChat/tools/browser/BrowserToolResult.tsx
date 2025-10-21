"use client";

import { cn } from "@/lib/utils";
import { ExtractResultView } from "./ExtractResultView";
import { MessageResultView } from "./MessageResultView";
import { ScreenshotView } from "./ScreenshotView";

// Style constants
const STYLES = {
  text: { primary: "text-gray-900 dark:text-gray-100" },
  bg: {
    card: "bg-white dark:bg-gray-900",
    error: "bg-gray-100 dark:bg-gray-800",
  },
  border: "border-gray-200 dark:border-gray-700",
} as const;

export interface BrowserToolResultType {
  success: boolean;
  error?: string;
  sessionUrl?: string;
  platformName?: string;
  data?: unknown;
  initialScreenshotUrl?: string;
  finalScreenshotUrl?: string;
  message?: string;
  screenshotUrl?: string;
}

// Sub-component: Section header
function SectionHeader({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn("pb-3", STYLES.border, "border-b", className)}>
      <span className={cn("text-sm font-semibold", STYLES.text.primary)}>
        {title}
      </span>
    </div>
  );
}

// Custom hook: Detect result type
function useBrowserResultType(result: BrowserToolResultType) {
  const isExtractResult = result.data !== undefined;
  const isMessageResult = result.message !== undefined;
  const displayScreenshot = result.finalScreenshotUrl || result.initialScreenshotUrl || result.screenshotUrl;
  
  const title = isExtractResult ? "Data Extracted Successfully" : 
                isMessageResult ? "Page Observed Successfully" :
                "Operation completed successfully";
  
  return { isExtractResult, isMessageResult, displayScreenshot, title };
}

export function BrowserToolResult({ result }: { result: BrowserToolResultType }) {
  // Error state
  if (!result.success) {
    return (
      <div className={cn(
        "p-4 rounded-xl border-l-4 border-l-gray-900 dark:border-l-gray-100 text-sm shadow-sm max-w-md",
        STYLES.bg.error,
        STYLES.text.primary
      )}>
        {result.error || "Browser operation failed"}
      </div>
    );
  }

  const { isExtractResult, isMessageResult, displayScreenshot, title } = useBrowserResultType(result);

  return (
    <div className="flex flex-col gap-3 max-w-4xl">
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl p-6 shadow-sm border",
        STYLES.border,
        STYLES.bg.card
      )}>
        {/* LEFT SIDE: Data/Message */}
        <div className="flex flex-col gap-4">
          <SectionHeader title={title} className="flex items-center gap-2" />
          
          {isExtractResult && (
            <div className="flex flex-col gap-3">
              <ExtractResultView data={result.data} />
            </div>
          )}

          {isMessageResult && !isExtractResult && (
            <MessageResultView message={result.message!} />
          )}

          {result.sessionUrl && (
            <a
              href={result.sessionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-auto"
            >
              🎥 View Browser Recording
            </a>
          )}
        </div>

        {/* RIGHT SIDE: Screenshot */}
        {displayScreenshot && (
          <div className="flex flex-col gap-3">
            <SectionHeader title={`${result.platformName || "Browser"} Screenshot`} />
            <ScreenshotView screenshotUrl={displayScreenshot} platformName={result.platformName} />
          </div>
        )}
      </div>
    </div>
  );
}
