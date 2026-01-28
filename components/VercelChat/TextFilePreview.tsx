import { TextAttachment } from "@/types/textAttachment";

interface TextFilePreviewProps {
  attachment: TextAttachment;
  onRemove?: () => void;
}

export function TextFilePreview({ attachment, onRemove }: TextFilePreviewProps) {
  const badge = attachment.type.toUpperCase();

  return (
    <div className="relative group">
      <div className="border border-border rounded-lg p-3 w-40 h-24 flex flex-col justify-between bg-background">
        <div>
          <p className="text-sm font-medium truncate">{attachment.filename}</p>
          <p className="text-xs text-muted-foreground">
            {attachment.lineCount} {attachment.lineCount === 1 ? "line" : "lines"}
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
