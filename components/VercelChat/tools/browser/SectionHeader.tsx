import { cn } from "@/lib/utils";

const STYLES = {
  text: { primary: "text-gray-900 dark:text-gray-100" },
  border: "border-gray-200 dark:border-border",
} as const;

export function SectionHeader({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn("pb-3", STYLES.border, "border-b", className)}>
      <span className={cn("text-sm font-semibold", STYLES.text.primary)}>
        {title}
      </span>
    </div>
  );
}

