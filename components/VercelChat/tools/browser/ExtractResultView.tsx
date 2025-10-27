import { cn } from "@/lib/utils";
import { formatFieldName } from "@/lib/browser/formatFieldName";
import { formatFieldValue } from "@/lib/browser/formatFieldValue";
import { isPriorityField } from "@/lib/browser/isPriorityField";
import { isPlainObject } from "@/lib/browser/isPlainObject";

const STYLES = {
  text: {
    primary: "text-gray-900 dark:text-gray-100",
    muted: "text-gray-600 dark:text-gray-400",
  },
} as const;

const MAX_DISPLAYED_FIELDS = 8;

export function ExtractResultView({ data }: { data: unknown }) {
  if (data === null || data === undefined) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No data extracted
      </div>
    );
  }

  // If it's not a plain object, display as simple value
  if (!isPlainObject(data)) {
    return (
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {String(data)}
      </div>
    );
  }

  // Display object properties in a readable format
  const entries = Object.entries(data);
  
  if (entries.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No data found
      </div>
    );
  }

  // Separate priority and other fields
  const priorityEntries = entries.filter(([key]) => isPriorityField(key));
  const otherEntries = entries.filter(([key]) => !isPriorityField(key));

  // Show priority fields first, limited to MAX_DISPLAYED_FIELDS
  const displayEntries = [...priorityEntries, ...otherEntries].slice(0, MAX_DISPLAYED_FIELDS);

  // Map to intermediate objects with formatted values
  const formattedItems = displayEntries.map(([key, value]) => ({
    key,
    label: formatFieldName(key),
    displayValue: formatFieldValue(value),
    isMetric: isPriorityField(key),
  }));

  // Filter out items with empty display values
  const validItems = formattedItems.filter(item => 
    item.displayValue !== null && item.displayValue !== ''
  );

  // Map to JSX (no nulls returned)
  return (
    <>
      {validItems.map(({ key, label, displayValue, isMetric }) => (
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
      ))}
    </>
  );
}

