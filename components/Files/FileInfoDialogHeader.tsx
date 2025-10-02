import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type FileInfoDialogHeaderProps = {
  fileName: string;
  isEditing: boolean;
  onEditToggle: (editing: boolean) => void;
  onSave: () => void;
};

export default function FileInfoDialogHeader({ 
  fileName, 
  isEditing, 
  onEditToggle, 
  onSave 
}: FileInfoDialogHeaderProps) {
  return (
    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <DialogHeader>
            <DialogTitle className="truncate text-sm sm:text-base">{fileName}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">File information</DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isEditing ? (
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 text-xs"
              onClick={() => onEditToggle(true)}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs"
                onClick={() => onEditToggle(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={onSave}
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

