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
            <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-gray-100"></div>
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
              Data Extracted Successfully
            </span>
          </div>
          
          {result.data !== undefined && (
            <div className="flex flex-col gap-2">
              {formatExtractedData(result.data)}
            </div>
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

/**
 * Format extracted data in a human-readable way
 */
function formatExtractedData(data: unknown): React.ReactNode {
  if (data === null || data === undefined) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No data extracted
      </div>
    );
  }

  // If it's not an object, display as simple value
  if (typeof data !== 'object' || Array.isArray(data)) {
    return (
      <div className="text-sm text-gray-900 dark:text-gray-100">
        {String(data)}
      </div>
    );
  }

  // Display object properties in a readable format
  const entries = Object.entries(data as Record<string, unknown>);
  
  if (entries.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No data found
      </div>
    );
  }

  // Filter and prioritize important fields
  const priorityFields = ['followerCount', 'followingCount', 'postCount', 'likesCount', 
                          'subscribers', 'views', 'price', 'rating', 'title', 'name'];
  
  // Separate priority and other fields
  const priorityEntries = entries.filter(([key]) => 
    priorityFields.some(field => key.toLowerCase().includes(field.toLowerCase()))
  );
  const otherEntries = entries.filter(([key]) => 
    !priorityFields.some(field => key.toLowerCase().includes(field.toLowerCase()))
  );

  // Show priority fields first (like follower counts)
  const displayEntries = [...priorityEntries, ...otherEntries].slice(0, 6); // Limit to 6 fields max

  return displayEntries.map(([key, value]) => {
    // Format the key to be human-readable
    const label = formatFieldName(key);
    const displayValue = formatFieldValue(value);

    // Skip empty values
    if (displayValue === null || displayValue === '') {
      return null;
    }

    // Highlight numeric metrics with larger text
    const isMetric = priorityFields.some(field => key.toLowerCase().includes(field.toLowerCase()));

    return (
      <div key={key} className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
        <span className={`${isMetric ? 'text-2xl' : 'text-sm'} text-gray-900 dark:text-gray-100 font-semibold`}>
          {displayValue}
        </span>
      </div>
    );
  });
}

/**
 * Convert camelCase or snake_case to Title Case
 */
function formatFieldName(fieldName: string): string {
  return fieldName
    // Handle camelCase: insert space before capitals
    .replace(/([A-Z])/g, ' $1')
    // Handle snake_case: replace underscores with spaces
    .replace(/_/g, ' ')
    // Capitalize first letter of each word
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

/**
 * Format field values to be human-readable
 */
function formatFieldValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    return value.trim() || null;
  }

  if (typeof value === 'number') {
    // Format large numbers with commas
    return value.toLocaleString();
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : null;
  }

  if (typeof value === 'object') {
    // For nested objects, show a simplified version
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

