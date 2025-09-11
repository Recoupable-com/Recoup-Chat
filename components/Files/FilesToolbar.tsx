"use client";

import { Button } from "@/components/ui/button";
import FilesBreadcrumb from "@/components/Files/FilesBreadcrumb";
import NewFolderDialog from "@/components/Files/NewFolderDialog";

interface FilesToolbarProps {
  base: string;
  relative: string[];
  onCreateFolder: (name: string) => Promise<unknown> | void;
  onFileSelected: (file: File) => void;
}

export default function FilesToolbar({ base, relative, onCreateFolder, onFileSelected }: FilesToolbarProps) {
  return (
    <div className="flex items-start gap-3 md:items-center">
      <div className="min-w-0">
        <h1 className="text-[20px] md:text-[22px] font-semibold tracking-tight leading-tight">Files</h1>
        <p className="mt-1 text-[12px] text-muted-foreground">Store and manage files per artist.</p>
        <div className="mt-2">
          <FilesBreadcrumb base={base} relative={relative} />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2 shrink-0">
        <NewFolderDialog onCreate={onCreateFolder} />
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFileSelected(f);
            }}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Button size="sm" variant="default">Upload</Button>
        </label>
      </div>
    </div>
  );
}


