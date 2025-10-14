"use client";

import Image from "next/image";

export interface BrowserExtractResultType {
  success: boolean;
  data?: unknown;
  initialScreenshotUrl?: string;
  finalScreenshotUrl?: string;
  sessionUrl?: string;
  platformName?: string;
  error?: string;
}

export function BrowserExtractResult({ result }: { result: BrowserExtractResultType }) {
  if (!result.success) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border-l-4 border-l-red-500 text-red-600 text-sm shadow-sm max-w-md">
        {result.error || "Failed to extract data"}
      </div>
    );
  }

  // Use final screenshot if available, otherwise use initial
  const displayScreenshot = result.finalScreenshotUrl || result.initialScreenshotUrl;

  return (
    <div className="flex flex-col gap-3 max-w-4xl">
      {/* Two-column card layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 shadow-sm">
        {/* LEFT SIDE: Extracted Data */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="font-medium text-sm text-green-900 dark:text-green-100">
              Data Extracted Successfully
            </span>
          </div>
          
          {result.data !== undefined && (
            <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto max-h-96">
              <code>{JSON.stringify(result.data, null, 2)}</code>
            </pre>
          )}

          {/* Session Link */}
          {result.sessionUrl && (
            <a
              href={result.sessionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-2"
            >
              🎥 View Browser Recording
            </a>
          )}
        </div>

        {/* RIGHT SIDE: Screenshot */}
        {displayScreenshot && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {result.platformName || "Browser"} Screenshot
            </span>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <Image
                src={displayScreenshot}
                alt={`${result.platformName || "Browser"} screenshot`}
                width={600}
                height={450}
                className="w-full h-auto"
                unoptimized
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

