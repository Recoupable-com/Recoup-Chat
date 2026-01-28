import { ParsedTextAttachment } from "@/lib/chat/parseTextAttachments";

interface TextAttachmentCardProps {
  attachment: ParsedTextAttachment;
}

/**
 * Read-only card for displaying text file attachments in message history.
 */
export function TextAttachmentCard({ attachment }: TextAttachmentCardProps) {
  const badge = attachment.type.toUpperCase();

  return (
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
  );
}
