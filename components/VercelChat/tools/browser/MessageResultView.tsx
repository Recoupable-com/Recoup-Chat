import { cn } from "@/lib/utils";

const STYLES = {
  text: {
    secondary: "text-gray-700 dark:text-gray-300",
  },
  bg: {
    code: "bg-gray-50 dark:bg-gray-800",
  },
  border: "border-gray-200 dark:border-gray-700",
} as const;

export function MessageResultView({ message }: { message: string }) {
  return (
    <div className={cn(
      "text-sm leading-relaxed whitespace-pre-wrap font-mono p-4 rounded-lg border overflow-x-auto max-h-96 overflow-y-auto",
      STYLES.text.secondary,
      STYLES.bg.code,
      STYLES.border
    )}>
      {message}
    </div>
  );
}

