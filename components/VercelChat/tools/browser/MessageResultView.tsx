import { cn } from "@/lib/utils";

const STYLES = {
  text: {
    secondary: "text-foreground dark:text-muted-foreground",
  },
  bg: {
    code: "bg-muted dark:bg-card",
  },
  border: "border-gray-200 dark:border-border",
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

