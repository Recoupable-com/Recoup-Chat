"use client";

import DeleteFileDialog from "@/components/Files/DeleteFileDialog";
import { useState } from "react";
import FilePropertiesPanel from "@/components/Files/FilePropertiesPanel";
import FilesGridList from "@/components/Files/FilesGridList";
import { FileRow } from "@/components/Files/types";

interface FilesGridProps {
  files: FileRow[];
  onDeleted?: () => void;
  ownerAccountId?: string;
  base?: string;
  currentArtistId?: string;
}

// Extract original artist owner from storage key
const getOriginalArtistId = (storageKey: string): string | null => {
  // Path format: files/{userId}/{artistId}/...
  const parts = storageKey.split('/');
  return parts.length >= 3 ? parts[2] : null;
};

export default function FilesGrid({
  files,
  onDeleted,
  ownerAccountId,
  base,
  currentArtistId,
}: FilesGridProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [target, setTarget] = useState<{
    id: string;
    storage_key: string;
    file_name: string;
  } | null>(null);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileRow | null>(null);
  return (
    <div className="flex">
      <div className={`transition-all duration-300 flex-1`}>
        <FilesGridList
          files={files}
          onDelete={(f) => {
            setTarget({ id: f.id, storage_key: f.storage_key, file_name: f.file_name });
            setDeleteOpen(true);
          }}
          onProperties={(f) => {
            setSelectedFile(f);
            setPropertiesOpen(true);
          }}
          currentArtistId={currentArtistId}
          getOriginalArtistId={getOriginalArtistId}
        />
      </div>

      {target && (
        <DeleteFileDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          id={target.id}
          storageKey={target.storage_key}
          fileName={target.file_name}
          ownerAccountId={ownerAccountId || ""}
          onDeleted={() => {
            setTarget(null);
            onDeleted?.();
          }}
        />
      )}
      <FilePropertiesPanel
        open={propertiesOpen}
        file={selectedFile}
        onClose={() => setPropertiesOpen(false)}
        base={base}
      />
    </div>
  );
}
