"use client";

import { useState, useCallback } from "react";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { FileRow } from "@/components/Files/types";
import FileTile from "@/components/Files/FileTile";

type FilesGridListProps = {
  files: FileRow[];
  onDelete: (file: FileRow) => void;
  onProperties: (file: FileRow) => void;
  currentArtistId?: string;
  getOriginalArtistId?: (storageKey: string) => string | null;
  selectedFiles: Set<string>;
  lastClickedIndex: number | null;
  onSelectionChange: (selectedFiles: Set<string>, lastClickedIndex: number | null) => void;
};

export default function FilesGridList({
  files,
  onDelete,
  onProperties,
  currentArtistId,
  getOriginalArtistId,
  selectedFiles,
  lastClickedIndex,
  onSelectionChange
}: FilesGridListProps) {

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
    }
  }, [selectedFiles, lastClickedIndex, files]);

  return (
    <PhotoProvider>
      <div 
        className="flex flex-wrap gap-2 p-1.5"
        onClick={(e) => {
          // Clear selection when clicking empty space (not on a file)
          if (e.target === e.currentTarget && !e.shiftKey) {
            onSelectionChange(new Set(), null);
          }
        }}
      >
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
    </PhotoProvider>
  );
}


