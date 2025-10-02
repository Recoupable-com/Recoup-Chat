import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FileInfoDialogHeaderProps = {
  fileName: string;
  isEditing: boolean;
  isSaving?: boolean;
  canEdit?: boolean;
  hasUnsavedChanges?: boolean;
  onEditToggle: (editing: boolean) => void;
  onSave: () => void;
};

export default function FileInfoDialogHeader({ 
  fileName, 
  isEditing,
  isSaving = false,
  canEdit = true,
  hasUnsavedChanges = false,
  onEditToggle, 
  onSave 
}: FileInfoDialogHeaderProps) {
  return (
    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <DialogHeader>
            <DialogTitle className="truncate text-sm sm:text-base flex items-center gap-2">
              {fileName}
              {hasUnsavedChanges && (
                <span className="text-xs font-normal text-muted-foreground">*</span>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {isSaving 
                ? "Saving changes..." 
                : hasUnsavedChanges 
                  ? "Unsaved changes • Press Cmd+S or Ctrl+S to save" 
                  : "File information"}
            </DialogDescription>
          </DialogHeader>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2 shrink-0">
            {!isEditing ? (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 px-3 text-xs"
                onClick={() => onEditToggle(true)}
                disabled={isSaving}
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
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={onSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

