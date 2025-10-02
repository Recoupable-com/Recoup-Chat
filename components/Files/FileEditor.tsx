import { Textarea } from "@/components/ui/textarea";

type FileEditorProps = {
  content: string;
  onChange: (value: string) => void;
};

export default function FileEditor({ content, onChange }: FileEditorProps) {
  return (
    <div className="flex-1 border border-border rounded-lg bg-background overflow-hidden flex flex-col">
      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 resize-none border-0 focus-visible:ring-0 font-mono text-xs sm:text-sm rounded-none h-full"
        placeholder="Start editing..."
      />
    </div>
  );
}

