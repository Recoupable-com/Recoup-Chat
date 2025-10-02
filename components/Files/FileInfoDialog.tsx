"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { FileRow } from "@/components/Files/types";
import { formatBytes } from "@/lib/utils/formatBytes";
import FileRelativePath from "./FileRelativePath";

type FileInfoDialogProps = {
  file: FileRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FileInfoDialog({ file, open, onOpenChange }: FileInfoDialogProps) {
  if (!file) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] sm:w-[92vw] max-w-5xl min-h-[50vh] max-h-[90vh] overflow-hidden p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b">
          <DialogTitle className="truncate text-sm sm:text-base">{file.file_name}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">File information</DialogDescription>
        </DialogHeader>

        {/* Two-column layout */}
        <div className="flex flex-col sm:flex-row h-full overflow-hidden">
          {/* Main content section */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 bg-muted/20">
            <div className="flex items-center justify-center h-full min-h-[300px] border-2 border-dashed border-border rounded-lg">
              <p className="text-sm text-muted-foreground">File content preview</p>
            </div>
          </div>

          {/* Right sidebar - metadata */}
          <div className="w-full sm:w-64 border-t sm:border-t-0 sm:border-l bg-background overflow-auto">
            <div className="p-3 sm:p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Metadata</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Type</div>
                  <div className="text-xs sm:text-sm font-medium">{file.is_directory ? "Folder" : "File"}</div>
                </div>
                {!file.is_directory && (
                  <div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Size</div>
                    <div className="text-xs sm:text-sm font-medium">{formatBytes(file.size_bytes)}</div>
                  </div>
                )}
                <div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">MIME</div>
                  <div className="text-xs sm:text-sm font-medium break-words">{file.mime_type || "Unknown"}</div>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Path</div>
                  <div className="text-[10px] sm:text-xs font-mono break-all">
                    <FileRelativePath storageKey={file.storage_key} isDirectory={file.is_directory} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

