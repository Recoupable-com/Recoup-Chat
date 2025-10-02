type FilePreviewProps = {
  content: string | null;
  loading: boolean;
  error: string | null;
  isTextFile: boolean;
};

export default function FilePreview({ content, loading, error, isTextFile }: FilePreviewProps) {
  if (!isTextFile) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] border-2 border-dashed border-border rounded-lg">
        <p className="text-sm text-muted-foreground">Preview not available for this file type</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] border border-border rounded-lg bg-background">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] border border-border rounded-lg bg-background">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 border border-border rounded-lg bg-background overflow-hidden flex flex-col">
      <div className="overflow-auto flex-1 p-4">
        <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-words">
          {content}
        </pre>
      </div>
    </div>
  );
}

