import { TextAttachment } from "@/types/textAttachment";

// Extends TextAttachment properties with optional remove handler
interface TextFileCardProps
  extends Pick<TextAttachment, "filename" | "lineCount" | "type"> {
  onRemove?: () => void;
}

/**
 * Card component for displaying text file attachments.
 * Used in both input preview (with onRemove) and message history (without).
 */
export function TextFileCard({
  filename,
  lineCount,
  type,
  onRemove,
}: TextFileCardProps) {
  const badge = type.toUpperCase();

  return (
    <div className="relative group">
      <div className="border border-border rounded-lg p-3 w-40 h-24 flex flex-col justify-between bg-background">
        <div>
          <p className="text-sm font-medium truncate">{filename}</p>
          <p className="text-xs text-muted-foreground">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </p>
        </div>
        <div className="self-start">
          <span className="text-xs px-1.5 py-0.5 bg-muted rounded font-medium">
            {badge}
          </span>
        </div>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-1 size-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove attachment"
        >
          <span className="text-xs">&times;</span>
        </button>
      )}
    </div>
  );
}
