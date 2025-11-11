"use client";

import { cn } from "@/lib/utils";
import { getBrowserResultType } from "@/lib/browser/getBrowserResultType";
import { ExtractResultView } from "./ExtractResultView";
import { MessageResultView } from "./MessageResultView";
import { ScreenshotView } from "./ScreenshotView";
import { SectionHeader } from "./SectionHeader";

// Style constants
const STYLES = {
  text: { primary: "text-gray-900 dark:text-gray-100" },
  bg: {
    card: "bg-white dark:bg-background",
    error: "bg-muted dark:bg-card",
  },
  border: "border-gray-200 dark:border-border",
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

  const { isExtractResult, isMessageResult, displayScreenshot, title } = getBrowserResultType(result);

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
