"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { FileRow } from "@/components/Files/types";
import { useFileContent } from "@/hooks/useFileContent";
import { useUpdateFile } from "@/hooks/useUpdateFile";
import FileInfoDialogHeader from "./FileInfoDialogHeader";
import FileInfoDialogContent from "./FileInfoDialogContent";
import FileInfoDialogMetadata from "./FileInfoDialogMetadata";

type FileInfoDialogProps = {
  file: FileRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FileInfoDialog({ file, open, onOpenChange }: FileInfoDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  
  const { content } = useFileContent(file?.file_name || "", file?.storage_key || "");
  const { mutate: updateFile, isPending: isSaving } = useUpdateFile();

  // Initialize edited content when content loads or editing starts
  useEffect(() => {
    if (content && isEditing && !editedContent) {
      setEditedContent(content);
    }
  }, [content, isEditing, editedContent]);

  // Reset editing state when dialog closes
  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      setEditedContent("");
    }
  }, [open]);

  if (!file) return null;

  // Extract account IDs from storage key
  const extractAccountIds = (storageKey: string) => {
    const parts = storageKey.split("/");
    return {
      ownerAccountId: parts[1] || "",
      artistAccountId: parts[2] || "",
    };
  };

  const { ownerAccountId, artistAccountId } = extractAccountIds(file.storage_key);

  const handleEditToggle = (editing: boolean) => {
    if (editing && content) {
      setEditedContent(content);
    } else {
      // Reset edited content when canceling
      setEditedContent("");
    }
    setIsEditing(editing);
  };

  const handleSave = () => {
    if (!ownerAccountId || !artistAccountId) {
      console.error("Missing account IDs");
      return;
    }

    updateFile(
      {
        storageKey: file.storage_key,
        content: editedContent,
        mimeType: file.mime_type || "text/plain",
        ownerAccountId,
        artistAccountId,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditedContent("");
        },
      }
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] sm:w-[92vw] max-w-5xl h-[90vh] p-0 gap-0 pt-6 flex flex-col">
        <FileInfoDialogHeader
          fileName={file.file_name}
          isEditing={isEditing}
          isSaving={isSaving}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
        />

        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
          <FileInfoDialogContent 
            isEditing={isEditing}
            fileName={file.file_name}
            storageKey={file.storage_key}
            editedContent={editedContent}
            onContentChange={setEditedContent}
          />
          <FileInfoDialogMetadata file={file} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

