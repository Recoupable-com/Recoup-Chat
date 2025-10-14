"use client";

import Image from "next/image";

export interface BrowserActResultType {
  success: boolean;
  message?: string;
  screenshotUrl?: string;
  sessionUrl?: string;
  platformName?: string;
  error?: string;
}

export function BrowserActResult({ result }: { result: BrowserActResultType }) {
  if (!result.success) {
    return (
      <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-l-4 border-l-gray-900 dark:border-l-gray-100 text-gray-900 dark:text-gray-100 text-sm shadow-sm max-w-md">
        {result.error || "Browser action failed"}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      {/* Screenshot */}
      {result.screenshotUrl && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
          <Image
            src={result.screenshotUrl}
            alt={`${result.platformName || "Browser"} screenshot`}
            width={800}
            height={600}
            className="w-full h-auto"
            unoptimized
          />
        </div>
      )}

      {/* Success Message */}
      <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-gray-100"></div>
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {result.message || "Action completed successfully"}
          </span>
        </div>
      </div>

      {/* Session Link */}
      {result.sessionUrl && (
        <a
          href={result.sessionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-900 dark:text-gray-100 hover:underline flex items-center gap-1"
        >
          🎥 View Browser Recording
        </a>
      )}
    </div>
  );
}

