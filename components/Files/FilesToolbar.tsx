"use client";

import { Button } from "@/components/ui/button";
import FilesBreadcrumb from "@/components/Files/FilesBreadcrumb";
import NewFolderDialog from "@/components/Files/NewFolderDialog";

interface FilesToolbarProps {
  base: string;
  relative: string[];
  onCreateFolder: (name: string) => Promise<unknown> | void;
  onFileSelected: (file: File) => void;
  selectedFiles: Set<string>;
  onDeleteSelected: () => void;
}

export default function FilesToolbar({ base, relative, onCreateFolder, onFileSelected, selectedFiles, onDeleteSelected }: FilesToolbarProps) {
  return (
    <div className="flex items-start gap-3 md:items-center">
      <div className="min-w-0">
        <p className="text-center md:text-left font-plus_jakarta_sans_bold text-3xl mb-4 dark:text-white">
          Files
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400 text-center md:text-left mb-4 font-light font-inter max-w-2xl">
          Store and manage files per artist.
        </p>
        <div className="mt-2">
          <FilesBreadcrumb base={base} relative={relative} />
        </div>
      </div>
      <div className="ml-auto flex flex-col items-end gap-2 shrink-0 -mt-4">
        <div className="flex items-center gap-2">
          <NewFolderDialog onCreate={onCreateFolder} />
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach(file => onFileSelected(file));
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Button size="sm" variant="default" className="rounded-lg">Upload</Button>
          </label>
        </div>
        {selectedFiles.size > 1 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {selectedFiles.size} selected
            </span>
            <button
              onClick={onDeleteSelected}
              className="text-xs text-destructive hover:text-destructive/80 underline"
            >
              Delete selected
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


