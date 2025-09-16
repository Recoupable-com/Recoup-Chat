"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import getFileVisual from "@/utils/getFileVisual";
import FileItemMenu from "@/components/Files/FileItemMenu";
import { FileRow } from "@/components/Files/types";

type FileTileProps = {
  file: FileRow;
  onDelete: (file: FileRow) => void;
  onProperties: (file: FileRow) => void;
};

export default function FileTile({ file, onDelete, onProperties }: FileTileProps) {
  const visual = getFileVisual(file.file_name, file.mime_type ?? null);
  const targetPath = file.is_directory ? file.storage_key : undefined;
  const isImage = visual.icon === "image";
  const signedUrl = `/api/files/signed-url?key=${encodeURIComponent(file.storage_key)}`;

  const TileContent = (
    <div className="group relative flex flex-col items-center gap-2 cursor-pointer">
      <div className={`${file.is_directory ? "text-muted-foreground" : visual.color} h-10 w-10 flex items-center justify-center [&_svg]:h-10 [&_svg]:w-10`}>
        <Icon name={file.is_directory ? "folder" : visual.icon} />
      </div>
      <div className="w-full truncate whitespace-nowrap text-center text-[11px] leading-snug font-medium text-foreground/90 hover:underline" title={file.file_name}>
        {file.file_name}
      </div>
      <div className="absolute right-1 bottom-1">
        <FileItemMenu
          id={file.id}
          fileName={file.file_name}
          storageKey={file.storage_key}
          isDirectory={file.is_directory}
          onAction={(action) => {
            if (action === "delete") onDelete(file);
            if (action === "properties") onProperties(file);
          }}
        />
      </div>
    </div>
  );

  if (file.is_directory) {
    return (
      <Link
        key={file.id}
        href={`?path=${encodeURIComponent(targetPath!)}`}
        className="rounded-md p-2 text-sm hover:bg-accent/30 block w-32 flex-none"
      >
        {TileContent}
      </Link>
    );
  }

  return (
    <div key={file.id} className="rounded-md p-2 text-sm hover:bg-accent/30 w-32 aspect-video flex-none">
      {isImage ? (
        <div className="group relative flex flex-col items-center gap-2 cursor-zoom-in">
          <img src={signedUrl} alt={file.file_name} className="h-10 w-10 object-cover rounded" />
          <div className="w-full truncate whitespace-nowrap text-center text-[11px] leading-snug font-medium text-foreground/90 hover:underline" title={file.file_name}>
            {file.file_name}
          </div>
          <div className="absolute right-1 bottom-1">
            <FileItemMenu
              id={file.id}
              fileName={file.file_name}
              storageKey={file.storage_key}
              onAction={(action) => {
                if (action === "delete") onDelete(file);
                if (action === "properties") onProperties(file);
              }}
            />
          </div>
        </div>
      ) : (
        TileContent
      )}
    </div>
  );
}


