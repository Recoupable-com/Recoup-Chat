"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { FileRow } from "@/components/Files/types";

type FileInfoDialogProps = {
  file: FileRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FileInfoDialog({ file, open, onOpenChange }: FileInfoDialogProps) {
  if (!file) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="truncate">{file.file_name}</DialogTitle>
          <DialogDescription>File information</DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid grid-cols-3 gap-y-2 text-sm">
          <div className="text-muted-foreground">Type</div>
          <div className="col-span-2">{file.is_directory ? "Folder" : "File"}</div>
          <div className="text-muted-foreground">MIME</div>
          <div className="col-span-2">{file.mime_type || "Unknown"}</div>
          <div className="text-muted-foreground">Storage key</div>
          <div className="col-span-2 break-all">{file.storage_key}</div>
          <div className="text-muted-foreground">ID</div>
          <div className="col-span-2 break-all">{file.id}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

