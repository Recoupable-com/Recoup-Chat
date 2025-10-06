import { Textarea } from "@/components/ui/textarea";

type TextFileEditorProps = {
  content: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  loading?: boolean;
  error?: string | null;
  showStats?: boolean;
  placeholder?: string;
  className?: string;
};

/**
 * Shared text file editor component
 * Supports both edit and view modes with optional statistics
 */
export default function TextFileEditor({
  content,
  onChange,
  isEditing,
  loading = false,
  error = null,
  showStats = true,
  placeholder = "Start editing...",
  className = "",
}: TextFileEditorProps) {
  // Calculate statistics for editor footer
  const charCount = content.length;
  const lineCount = content.split("\n").length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  // Edit mode
  if (isEditing) {
    return (
      <div className={`flex-1 border border-border rounded-lg bg-background flex flex-col overflow-hidden ${className}`}>
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 resize-none border-0 focus-visible:ring-0 font-mono text-xs sm:text-sm rounded-none overflow-auto"
          placeholder={placeholder}
        />
        {showStats && (
          <div className="px-3 py-1.5 border-t text-[10px] sm:text-xs text-muted-foreground bg-muted/30 flex items-center gap-3 shrink-0">
            <span>{lineCount} {lineCount === 1 ? "line" : "lines"}</span>
            <span>•</span>
            <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
            <span>•</span>
            <span>{charCount} {charCount === 1 ? "character" : "characters"}</span>
          </div>
        )}
      </div>
    );
  }

  // View mode (read-only)
  return (
    <div className={`flex-1 overflow-auto ${className}`}>
      <pre className="whitespace-pre-wrap break-words font-mono text-xs sm:text-sm leading-relaxed p-3 sm:p-4 min-w-0">
        {content}
      </pre>
    </div>
  );
}

