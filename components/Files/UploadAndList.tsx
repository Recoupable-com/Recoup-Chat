"use client";

import useFilesManager from "@/hooks/useFilesManager";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
import NewFolderDialog from "@/components/Files/NewFolderDialog";
import useFilesPath from "@/hooks/useFilesPath";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import Link from "next/link";
import FilesBreadcrumb from "@/components/Files/FilesBreadcrumb";

export default function UploadAndList() {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const base = `files/${userData?.account_id || ""}/${selectedArtist?.account_id || ""}/`;
  const { path } = useFilesPath(base);
  const { files, isLoading, setFile, status, handleUpload, createFolder } = useFilesManager(path);

  const parts = path.replace(/\/$/, "").split("/");
  const relative = parts.length > 3 ? parts.slice(3) : [];

  return (
    <div className="space-y-4 px-2 md:px-0">
      <div className="flex items-start gap-3 md:items-center">
        <div className="min-w-0">
          <h1 className="text-[20px] md:text-[22px] font-semibold tracking-tight leading-tight">Files</h1>
          <p className="mt-1 text-[12px] text-muted-foreground">Store and manage files per artist.</p>
          <div className="mt-2">
            <FilesBreadcrumb base={base} relative={relative} />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <NewFolderDialog onCreate={createFolder} />
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  handleUpload(f);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Button size="sm" variant="default">Upload</Button>
          </label>
        </div>
      </div>
      {status && <div className="text-xs text-muted-foreground pl-[2px]">{status}</div>}

      <div className="rounded-lg">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading...</div>
        ) : files.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No files yet.</div>
        ) : (
          <div className="grid grid-cols-4 gap-2 p-1.5 md:grid-cols-6 lg:grid-cols-8">
            {files.map((f) => {
              const targetPath = f.is_directory ? `${path}${f.file_name}/` : undefined;
              const TileContent = (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-muted-foreground">
                    <Icon name={f.is_directory ? "folder" : "plain"} />
                  </div>
                  <div
                    className="w-full truncate whitespace-nowrap text-center text-[11px] leading-snug font-medium text-foreground/90 hover:underline"
                    title={f.file_name}
                  >
                    {f.file_name}
                  </div>
                </div>
              );

              return f.is_directory ? (
                <Link
                  key={f.id}
                  href={`?path=${encodeURIComponent(targetPath!)}`}
                  className="rounded-md p-2 text-sm hover:bg-accent/30 block"
                >
                  {TileContent}
                </Link>
              ) : (
                <div key={f.id} className="rounded-md p-2 text-sm hover:bg-accent/30">
                  {TileContent}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
