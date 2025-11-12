import { cn } from "@/lib/utils";

const STYLES = {
  text: { primary: "text-foreground dark:text-foreground" },
  border: "border-border dark:border-border",
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

