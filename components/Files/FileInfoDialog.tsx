"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { FileRow } from "@/components/Files/types";
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
  
  if (!file) return null;

  const handleSave = () => {
    // TODO: Save functionality
    setIsEditing(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] sm:w-[92vw] max-w-5xl min-h-[50vh] max-h-[90vh] overflow-hidden p-0 gap-0 pt-6">
        <FileInfoDialogHeader
          fileName={file.file_name}
          isEditing={isEditing}
          onEditToggle={setIsEditing}
          onSave={handleSave}
        />

        <div className="flex flex-col sm:flex-row h-full overflow-hidden">
          <FileInfoDialogContent isEditing={isEditing} />
          <FileInfoDialogMetadata file={file} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

