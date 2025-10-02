type FileInfoDialogContentProps = {
  isEditing: boolean;
};

export default function FileInfoDialogContent({ isEditing }: FileInfoDialogContentProps) {
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 bg-muted/20">
      {isEditing ? (
        <div className="h-full min-h-[300px] border border-border rounded-lg bg-background p-3">
          <p className="text-sm text-muted-foreground">Edit mode - Editor will go here</p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[300px] border-2 border-dashed border-border rounded-lg">
          <p className="text-sm text-muted-foreground">File content preview</p>
        </div>
      )}
    </div>
  );
}

