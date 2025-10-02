"use client";

import { useCallback, useState } from "react";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { FileRow } from "@/components/Files/types";
import FileTile from "@/components/Files/FileTile";
import getFileVisual from "@/utils/getFileVisual";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { Upload } from "lucide-react";
import FileInfoDialog from "./FileInfoDialog";

type FilesGridListProps = {
  files: FileRow[];
  onDelete: (file: FileRow) => void;
  onProperties: (file: FileRow) => void;
  currentArtistId?: string;
  getOriginalArtistId?: (storageKey: string) => string | null;
  selectedFiles: Set<string>;
  lastClickedIndex: number | null;
  onSelectionChange: (selectedFiles: Set<string>, lastClickedIndex: number | null) => void;
  onFilesDropped?: (files: File[]) => void;
};

export default function FilesGridList({
  files,
  onDelete,
  onProperties,
  currentArtistId,
  getOriginalArtistId,
  selectedFiles,
  lastClickedIndex,
  onSelectionChange,
  onFilesDropped,
}: FilesGridListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfoFile, setDialogInfoFile] = useState<FileRow | null>(null);

  // Drag and drop functionality
  const { getRootProps, getInputProps, isDragging, isDragReject } = useDragAndDrop({
    onDrop: (files) => {
      if (onFilesDropped) {
        onFilesDropped(files);
      }
    },
    maxFiles: 100,
    maxSizeMB: 100,
  });

  const handleFileClick = useCallback((file: FileRow, index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering clearSelection
    
    if (event.shiftKey && lastClickedIndex !== null) {
      // Shift-click: select range
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      const newSelected = new Set<string>();
      
      for (let i = start; i <= end; i++) {
        if (files[i]) {
          newSelected.add(files[i].id);
        }
      }
      
      onSelectionChange(newSelected, lastClickedIndex);
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd-click: toggle selection
      const newSelected = new Set(selectedFiles);
      if (newSelected.has(file.id)) {
        newSelected.delete(file.id);
      } else {
        newSelected.add(file.id);
      }
      onSelectionChange(newSelected, index);
    } else {
      // Regular click: single selection
      onSelectionChange(new Set([file.id]), index);
      
      // Open dialog for non-image, non-directory files
      const visual = getFileVisual(file.file_name, file.mime_type ?? null);
      if (!file.is_directory && visual.icon !== "image") {
        setDialogInfoFile(file);
        setDialogOpen(true);
      }
    }
  }, [selectedFiles, lastClickedIndex, files, onSelectionChange]);

  return (
    <PhotoProvider>
      <div 
        {...getRootProps()}
        className={`flex flex-wrap gap-2 p-1.5 rounded-lg transition-all relative ${
          isDragging 
            ? "ring-2 ring-primary ring-offset-2 bg-primary/5" 
            : isDragReject
            ? "ring-2 ring-destructive ring-offset-2 bg-destructive/5"
            : ""
        }`}
        onClick={(e) => {
          // Clear selection when clicking empty space (not on a file)
          if (e.target === e.currentTarget && !e.shiftKey) {
            onSelectionChange(new Set(), null);
          }
        }}
      >
        <input {...getInputProps()} />
        
        {/* Drop zone overlay */}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm rounded-lg z-10 pointer-events-none">
            <div className="flex flex-col items-center gap-3 text-primary">
              <Upload className="h-12 w-12 animate-bounce" />
              <p className="text-lg font-medium">Drop files here</p>
            </div>
          </div>
        )}

        {files.map((f, index) => {
          // Determine ownership by comparing current artist with original file owner
          const originalArtistId = getOriginalArtistId?.(f.storage_key);
          const isOwner = currentArtistId && originalArtistId ? currentArtistId === originalArtistId : false;
          const isSelected = selectedFiles.has(f.id);

          return (
            <FileTile
              key={f.id}
              file={f}
              onDelete={onDelete}
              onProperties={onProperties}
              isOwner={isOwner}
              isSelected={isSelected}
              onClick={(event) => handleFileClick(f, index, event)}
            />
          );
        })}
      </div>
      <FileInfoDialog 
        file={dialogInfoFile} 
        open={dialogOpen} 
        onOpenChange={(open: boolean) => {
          setDialogOpen(open);
          if (!open) setDialogInfoFile(null);
        }} 
      />
    </PhotoProvider>
  );
}
