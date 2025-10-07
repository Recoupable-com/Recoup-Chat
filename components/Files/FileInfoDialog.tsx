"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { FileRow } from "@/components/Files/types";
import { useTextContent } from "@/hooks/useTextContent";
import { useTextEditor } from "@/hooks/useTextEditor";
import { useTextFileSave } from "@/hooks/useTextFileSave";
import { useKeyboardSave } from "@/hooks/useKeyboardSave";
import { isTextFile } from "@/utils/isTextFile";
import { extractAccountIds } from "@/utils/extractAccountIds";
import FileInfoDialogHeader from "./FileInfoDialogHeader";
import FileInfoDialogContent from "./FileInfoDialogContent";
import FileInfoDialogMetadata from "./FileInfoDialogMetadata";

type FileInfoDialogProps = {
  file: FileRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FileInfoDialog({ file, open, onOpenChange }: FileInfoDialogProps) {
  // Extract account IDs and check if file is editable
  const { ownerAccountId, artistAccountId } = file 
    ? extractAccountIds(file.storage_key) 
    : { ownerAccountId: "", artistAccountId: "" };
  const canEdit = file ? isTextFile(file.file_name) : false;

  // Fetch file content
  const { content, loading, error } = useTextContent({
    storageKey: file?.storage_key || null,
    fileName: file?.file_name,
  });

  // Setup save handler for Supabase
  const { handleSave: saveFile } = useTextFileSave({
    type: "supabase",
    storageKey: file?.storage_key || "",
    fileName: file?.file_name || "",
    ownerAccountId,
    artistAccountId,
    mimeType: file?.mime_type || null,
  });

  // Setup text editor
  const {
    isEditing,
    editedContent,
    isSaving,
    hasUnsavedChanges,
    setEditedContent,
    handleSave,
    handleEditToggle: baseHandleEditToggle,
  } = useTextEditor({
    content,
    isDialogOpen: open,
    onSave: saveFile,
  });

  // Keyboard shortcut for saving
  useKeyboardSave({
    isOpen: open,
    isEditing,
    hasUnsavedChanges,
    isSaving,
    onSave: handleSave,
  });

  if (!file) return null;

  // Wrap edit toggle with text file validation
  const handleEditToggle = (editing: boolean) => {
    if (!canEdit && editing) {
      toast.error("Only text files can be edited");
      return;
    }
    baseHandleEditToggle(editing);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] sm:w-[92vw] max-w-5xl h-[90vh] p-0 gap-0 pt-6 flex flex-col">
        <FileInfoDialogHeader
          fileName={file.file_name}
          isEditing={isEditing}
          isSaving={isSaving}
          canEdit={canEdit}
          hasUnsavedChanges={hasUnsavedChanges}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
        />

        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
          <FileInfoDialogContent 
            isEditing={isEditing}
            fileName={file.file_name}
            content={content}
            editedContent={editedContent}
            onContentChange={setEditedContent}
            loading={loading}
            error={error}
          />
          <FileInfoDialogMetadata file={file} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

