type Props = {
  isImage: boolean;
  isText: boolean;
  isEditing: boolean;
  editedText: string;
  setEditedText: (v: string) => void;
  loading: boolean;
  error: string | null;
  textContent: string;
  url: string;
  name: string;
};

const KnowledgePreview = ({
  isImage,
  isText,
  isEditing,
  editedText,
  setEditedText,
  loading,
  error,
  textContent,
  url,
  name,
}: Props) => {
  if (isImage) {
    return (
      <div className="min-h-0 h-full overflow-auto bg-muted flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={name || "image"} className="max-h-full max-w-full object-contain" />
      </div>
    );
  }

  if (isText) {
    return (
      <div className="min-h-0 h-full overflow-auto bg-background">
        <div className="h-full overflow-auto p-3 sm:p-4">
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full h-[55vh] sm:h-[60vh] lg:h-[65vh] text-xs sm:text-sm font-mono resize-none border border-input rounded-md bg-transparent px-3 py-2"
            />
          ) : loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <pre className="whitespace-pre-wrap break-words font-mono text-xs sm:text-sm leading-relaxed overflow-auto min-w-0">
              {textContent}
            </pre>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 overflow-auto flex items-center justify-center text-xs sm:text-sm text-muted-foreground px-4 py-6 sm:p-8">
      <div className="text-center space-y-2">
        <p className="font-medium">Preview not available</p>
        <p>Use the button above to open the file in a new tab.</p>
      </div>
    </div>
  );
};

export default KnowledgePreview;