"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

// Style constants following component-design standards
const STYLES = {
  text: {
    primary: "text-gray-900 dark:text-gray-100",
    secondary: "text-gray-700 dark:text-gray-300",
    muted: "text-gray-600 dark:text-gray-400",
  },
  bg: {
    card: "bg-white dark:bg-gray-900",
    error: "bg-gray-100 dark:bg-gray-800",
    code: "bg-gray-50 dark:bg-gray-800",
  },
  border: "border-gray-200 dark:border-gray-700",
} as const;

export interface BrowserToolResultType {
  success: boolean;
  
  // Common fields
  error?: string;
  sessionUrl?: string;
  platformName?: string;
  
  // For browser_extract
  data?: unknown;
  initialScreenshotUrl?: string;
  finalScreenshotUrl?: string;
  
  // For browser_act
  message?: string;
  screenshotUrl?: string;
}

// Sub-component: Section header following composition pattern
function SectionHeader({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn("pb-3", STYLES.border, "border-b", className)}>
      <span className={cn("text-sm font-semibold", STYLES.text.primary)}>
        {title}
      </span>
    </div>
  );
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

  // Determine result type and screenshot
  const isExtractResult = result.data !== undefined;
  const isMessageResult = result.message !== undefined;
  const displayScreenshot = result.finalScreenshotUrl || result.initialScreenshotUrl || result.screenshotUrl;

  return (
    <div className="flex flex-col gap-3 max-w-4xl">
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl p-6 shadow-sm",
        STYLES.border,
        STYLES.bg.card,
        "border"
      )}>
        {/* LEFT SIDE: Data/Message */}
        <div className="flex flex-col gap-4">
          <SectionHeader 
            title={isExtractResult ? "Data Extracted Successfully" : 
                   isMessageResult ? "Page Observed Successfully" :
                   "Operation completed successfully"}
            className="flex items-center gap-2"
          />
          
          {/* Extract result: show formatted data */}
          {isExtractResult && (
            <div className="flex flex-col gap-3">
              {formatExtractedData(result.data)}
            </div>
          )}

          {/* Message result: show the message text */}
          {isMessageResult && !isExtractResult && (
            <div className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap font-mono p-4 rounded-lg border overflow-x-auto max-h-96 overflow-y-auto",
              STYLES.text.secondary,
              STYLES.bg.code,
              STYLES.border
            )}>
              {result.message}
            </div>
          )}

          {/* Session Link */}
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
            <div className={cn("rounded-lg overflow-hidden shadow-sm border", STYLES.border)}>
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

// Priority metric field names
const PRIORITY_FIELDS = [
  'followerCount', 'followingCount', 'postCount', 'likesCount', 
  'subscribers', 'views', 'price', 'rating', 'title', 'name'
] as const;

// Helper: Check if field name is a priority metric
const isPriorityField = (key: string): boolean =>
  PRIORITY_FIELDS.some(field => key.toLowerCase().includes(field.toLowerCase()));

function formatExtractedData(data: unknown): React.ReactNode {
  if (data === null || data === undefined) {
    return (
      <div className={cn("text-sm", STYLES.text.muted)}>
        No data extracted
      </div>
    );
  }

  // If it's not an object, display as simple value
  if (typeof data !== 'object' || Array.isArray(data)) {
    return (
      <div className={cn("text-sm", STYLES.text.secondary)}>
        {String(data)}
      </div>
    );
  }

  // Display object properties in a readable format
  const entries = Object.entries(data as Record<string, unknown>);
  
  if (entries.length === 0) {
    return (
      <div className={cn("text-sm", STYLES.text.muted)}>
        No data found
      </div>
    );
  }

  // Separate priority and other fields using extracted helper
  const priorityEntries = entries.filter(([key]) => isPriorityField(key));
  const otherEntries = entries.filter(([key]) => !isPriorityField(key));

  // Show priority fields first (like follower counts), max 8 fields
  const displayEntries = [...priorityEntries, ...otherEntries].slice(0, 8);

  return displayEntries.map(([key, value]) => {
    const label = formatFieldName(key);
    const displayValue = formatFieldValue(value);

    // Skip empty values
    if (displayValue === null || displayValue === '') {
      return null;
    }

    const isMetric = isPriorityField(key);

    return (
      <div 
        key={key} 
        className="flex items-baseline justify-between gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
      >
        <span className={cn("text-sm font-medium flex-shrink-0", STYLES.text.muted)}>
          {label}
        </span>
        <span className={cn(
          "text-sm text-right",
          isMetric ? "font-semibold" : "font-normal",
          STYLES.text.primary
        )}>
          {displayValue}
        </span>
      </div>
    );
  });
}

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

