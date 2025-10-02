import { Textarea } from "@/components/ui/textarea";

type FileEditorProps = {
  content: string;
  onChange: (value: string) => void;
};

export default function FileEditor({ content, onChange }: FileEditorProps) {
  // Calculate character and line count
  const charCount = content.length;
  const lineCount = content.split("\n").length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="flex-1 border border-border rounded-lg bg-background overflow-hidden flex flex-col">
      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 resize-none border-0 focus-visible:ring-0 font-mono text-xs sm:text-sm rounded-none h-full"
        placeholder="Start editing..."
      />
      <div className="px-3 py-1.5 border-t text-[10px] sm:text-xs text-muted-foreground bg-muted/30 flex items-center gap-3">
        <span>{lineCount} {lineCount === 1 ? "line" : "lines"}</span>
        <span>•</span>
        <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
        <span>•</span>
        <span>{charCount} {charCount === 1 ? "character" : "characters"}</span>
      </div>
    </div>
  );
}

