"use client";

import Link from "next/link";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import Icon from "@/components/Icon";
import getFileVisual from "@/utils/getFileVisual";

interface FileRow { id: string; file_name: string; storage_key: string; mime_type?: string | null; is_directory?: boolean }

export default function FilesGrid({ files }: { files: FileRow[] }) {
  return (
    <PhotoProvider>
      <div className="grid grid-cols-4 gap-2 p-1.5 md:grid-cols-6 lg:grid-cols-8">
        {files.map((f) => {
          const targetPath = f.is_directory ? f.storage_key : undefined;
          const visual = getFileVisual(f.file_name, f.mime_type ?? null);

          const TileContent = (
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <div className={`${f.is_directory ? "text-muted-foreground" : visual.color} h-10 w-10 flex items-center justify-center [&_svg]:h-10 [&_svg]:w-10`}>
                <Icon name={f.is_directory ? "folder" : visual.icon} />
              </div>
              <div className="w-full truncate whitespace-nowrap text-center text-[11px] leading-snug font-medium text-foreground/90 hover:underline" title={f.file_name}>
                {f.file_name}
              </div>
            </div>
          );

          if (f.is_directory) {
            return (
              <Link key={f.id} href={`?path=${encodeURIComponent(targetPath!)}`} className="rounded-md p-2 text-sm hover:bg-accent/30 block">
                {TileContent}
              </Link>
            );
          }

          const isImage = visual.icon === "image";
          const fileKey = f.storage_key;
          const signedUrl = `/api/files/signed-url?key=${encodeURIComponent(fileKey)}`;

          return (
            <div key={f.id} className="rounded-md p-2 text-sm hover:bg-accent/30">
              {isImage ? (
                <PhotoView src={signedUrl}>
                  <div className="flex flex-col items-center gap-2 cursor-zoom-in">
                    <img src={signedUrl} alt={f.file_name} className="h-10 w-10 object-cover rounded" />
                    <div className="w-full truncate whitespace-nowrap text-center text-[11px] leading-snug font-medium text-foreground/90 hover:underline" title={f.file_name}>
                      {f.file_name}
                    </div>
                  </div>
                </PhotoView>
              ) : (
                TileContent
              )}
            </div>
          );
        })}
      </div>
    </PhotoProvider>
  );
}


