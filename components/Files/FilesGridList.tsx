"use client";

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
};

export default function FilesGridList({
  files,
  onDelete,
  onProperties,
  currentArtistId,
  getOriginalArtistId
}: FilesGridListProps) {
  return (
    <PhotoProvider>
      <div className="flex flex-wrap gap-2 p-1.5">
        {files.map((f) => {
          // Determine ownership by comparing current artist with original file owner
          const originalArtistId = getOriginalArtistId?.(f.storage_key);
          const isOwner = currentArtistId && originalArtistId ? currentArtistId === originalArtistId : false;

          return (
            <FileTile
              key={f.id}
              file={f}
              onDelete={onDelete}
              onProperties={onProperties}
              isOwner={isOwner}
            />
          );
        })}
      </div>
    </PhotoProvider>
  );
}


