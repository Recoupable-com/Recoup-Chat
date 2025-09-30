"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import getFileVisual from "@/utils/getFileVisual";
import FileItemMenu from "@/components/Files/FileItemMenu";
import { FileRow } from "@/components/Files/types";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

type FileTileProps = {
  file: FileRow;
  onDelete: (file: FileRow) => void;
  onProperties: (file: FileRow) => void;
  isOwner?: boolean;
  isSelected?: boolean;
  onClick?: (event: React.MouseEvent) => void;
};

export default function FileTile({ file, onDelete, onProperties, isSelected, onClick }: FileTileProps) {
  const visual = getFileVisual(file.file_name, file.mime_type ?? null);
  const targetPath = file.is_directory ? file.storage_key : undefined;
  const isImage = visual.icon === "image";
  const signedUrl = `/api/files/signed-url?key=${encodeURIComponent(file.storage_key)}`;

  // macOS Finder-style container styling using shadcn theme colors
  const containerClasses = cn(
    "group relative rounded-xl bg-card hover:bg-accent transition-all duration-200 cursor-pointer",
    "w-32 h-32 flex flex-col items-center justify-start p-4 gap-3",
    "hover:shadow-sm border border-border",
    isSelected && "bg-accent border-accent-foreground/20"
  );

  // macOS Finder-style icon container - minimal by default
  const iconClasses = cn(
    "h-16 w-16 flex items-center justify-center rounded-lg",
    file.is_directory ? "text-black" : `${visual.color}`,
    "group-hover:scale-105 group-hover:drop-shadow-sm transition-all duration-200 [&_svg]:h-10 [&_svg]:w-10"
  );

  // macOS Finder-style file name styling
  const fileNameClasses = "w-full truncate whitespace-nowrap text-center text-sm leading-relaxed font-medium text-gray-700 group-hover:text-gray-900 px-1";

  const content = (
    <>
      {/* Icon */}
      <div className="relative">
        <div className={iconClasses}>
          {isImage && !file.is_directory ? (
            <div className="w-full h-full relative">
              {/* <Skeleton className="w-full h-full absolute animate-pulse"/> */}
              <div className="w-full h-full rounded-lg absolute inset-0 z-0 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={signedUrl}
                alt={file.file_name}
                loading="lazy"
                className="h-full w-full object-cover rounded-lg absolute inset-0 z-10"
                onLoad={(e) => {
                  // Hide the placeholder SVG icon when image loads
                  const img = e.target as HTMLImageElement;
                  const placeholder = img.previousElementSibling as HTMLElement;
                  if (placeholder) {
                    placeholder.style.display = 'none';
                  }
                }}
              />
            </div>
          ) : (
            <Icon
              name={file.is_directory ? "folder" : visual.icon}
            />
          )}
        </div>
      </div>

      {/* File Name */}
      <div className={fileNameClasses} title={file.file_name}>
        {file.file_name}
      </div>

      {/* Menu Button - positioned absolutely in top-right */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
    </>
  );

  if (file.is_directory) {
    return (
      <Link
        href={`?path=${encodeURIComponent(targetPath!)}`}
        className={containerClasses}
        onClick={(e) => {
          if (onClick && (e.shiftKey || e.ctrlKey || e.metaKey)) {
            e.preventDefault(); // Prevent navigation when selecting
            onClick(e);
          }
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div 
      className={containerClasses}
      onClick={onClick}
    >
      {content}
    </div>
  );
}
