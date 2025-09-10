"use client";

import useFilesManager from "@/hooks/useFilesManager";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
import NewFolderDialog from "@/components/Files/NewFolderDialog";
import useFilesPath from "@/hooks/useFilesPath";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";

export default function UploadAndList() {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const base = `files/${userData?.account_id || ""}/${selectedArtist?.account_id || ""}/`;
  const { path } = useFilesPath(base);
  const { files, isLoading, setFile, status, handleUpload, createFolder } = useFilesManager(path);

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Files</h1>
          <p className="text-xs text-muted-foreground">Store and manage files per artist.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
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
      {status && <div className="text-xs text-muted-foreground">{status}</div>}

      <div className="rounded-lg">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading...</div>
        ) : files.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No files yet.</div>
        ) : (
          <div className="grid grid-cols-4 gap-2 p-2 md:grid-cols-6 lg:grid-cols-8">
            {files.map((f) => (
              <div key={f.id} className="rounded-md p-2 text-sm hover:bg-accent/40">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-muted-foreground">
                    <Icon name={f.is_directory ? "folder" : "plain"} />
                  </div>
                  <div
                    className="w-full truncate whitespace-nowrap text-center text-xs leading-snug font-medium text-foreground hover:underline"
                    title={f.file_name}
                  >
                    {f.file_name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
