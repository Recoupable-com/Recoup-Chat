"use client";

import useFilesManager from "@/hooks/useFilesManager";
import FilesGridSkeleton from "@/components/Files/FilesGridSkeleton";
import useFilesPath from "@/hooks/useFilesPath";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import FilesToolbar from "@/components/Files/FilesToolbar";
import FilesGrid from "@/components/Files/FilesGrid";

export default function UploadAndList() {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const base = `files/${userData?.account_id || ""}/${selectedArtist?.account_id || ""}/`;
  const { path } = useFilesPath(base);
  const { files, isLoading, setFile, status, handleUpload, createFolder, refreshFiles, ownerAccountId } = useFilesManager(path);

  const parts = path.replace(/\/$/, "").split("/");
  const relative = parts.length > 3 ? parts.slice(3) : [];

  return (
    <div className="space-y-4 px-2 md:px-0">
      <FilesToolbar
        base={base}
        relative={relative}
        onCreateFolder={createFolder}
        onFileSelected={(f) => {
          setFile(f);
          handleUpload(f);
        }}
      />
      {status && <div className="text-xs text-muted-foreground pl-[2px]">{status}</div>}

      <div className="rounded-lg">
        {isLoading ? (
          <FilesGridSkeleton />
        ) : files.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No files yet.</div>
        ) : (
          <FilesGrid files={files as { id: string; file_name: string; storage_key: string; mime_type?: string | null; is_directory?: boolean }[]} onDeleted={refreshFiles} ownerAccountId={ownerAccountId} />
        )}
      </div>
    </div>
  );
}
