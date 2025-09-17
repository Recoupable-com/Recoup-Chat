"use client";

import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { FileRow } from "@/components/Files/types";
import FileTile from "@/components/Files/FileTile";

type FilesGridListProps = {
  files: FileRow[];
  onDelete: (file: FileRow) => void;
  onProperties: (file: FileRow) => void;
};

export default function FilesGridList({
  files,
  onDelete,
  onProperties,
}: FilesGridListProps) {
  return (
    <PhotoProvider>
      <div className="flex flex-wrap gap-2 p-1.5">
        {files.map((f) => {
          return (
            <FileTile
              key={f.id}
              file={f}
              onDelete={onDelete}
              onProperties={onProperties}
            />
          );
        })}
      </div>
    </PhotoProvider>
  );
}
