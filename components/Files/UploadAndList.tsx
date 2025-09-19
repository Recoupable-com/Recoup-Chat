"use client";

import { useState, useEffect } from "react";
import useFilesManager from "@/hooks/useFilesManager";
import FilesGridSkeleton from "@/components/Files/FilesGridSkeleton";
import useFilesPath from "@/hooks/useFilesPath";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import FilesToolbar from "@/components/Files/FilesToolbar";
import FilesGrid from "@/components/Files/FilesGrid";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function UploadAndList() {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const base = `files/${userData?.account_id || ""}/${selectedArtist?.account_id || ""}/`;
  const { path } = useFilesPath(base);
  const { files, isLoading, setFile, status, handleUpload, createFolder, refreshFiles, ownerAccountId } = useFilesManager(path);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [batchDeleteTarget, setBatchDeleteTarget] = useState<{files: {id: string, storage_key: string, file_name: string}[]} | null>(null);

  const parts = path.replace(/\/$/, "").split("/");
  const relative = parts.length > 3 ? parts.slice(3) : [];

  const handleSelectionChange = (newSelectedFiles: Set<string>, newLastClickedIndex: number | null) => {
    setSelectedFiles(newSelectedFiles);
    setLastClickedIndex(newLastClickedIndex);
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
    setLastClickedIndex(null);
  };

  // Clear selection when path changes (folder navigation)
  useEffect(() => {
    clearSelection();
  }, [path]);

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
        selectedFiles={selectedFiles}
        onClearSelection={clearSelection}
        onDeleteSelected={() => {
          const selectedFileObjects = files.filter(f => selectedFiles.has(f.id));
          setBatchDeleteTarget({
            files: selectedFileObjects.map(f => ({
              id: f.id,
              storage_key: f.storage_key,
              file_name: f.file_name
            }))
          });
        }}
      />
      {status && <div className="text-xs text-muted-foreground pl-[2px]">{status}</div>}

      <div className="rounded-lg">
        {isLoading ? (
          <FilesGridSkeleton />
        ) : files.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No files yet.</div>
        ) : (
          <FilesGrid
            files={files as { id: string; file_name: string; storage_key: string; mime_type?: string | null; is_directory?: boolean }[]}
            onDeleted={refreshFiles}
            ownerAccountId={ownerAccountId}
            base={base}
            currentArtistId={selectedArtist?.account_id}
            selectedFiles={selectedFiles}
            lastClickedIndex={lastClickedIndex}
            onSelectionChange={handleSelectionChange}
          />
        )}
      </div>
      
      {/* Batch Delete Dialog */}
      {batchDeleteTarget && (
        <AlertDialog open={!!batchDeleteTarget} onOpenChange={(open) => !open && setBatchDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {batchDeleteTarget.files.length} files?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete these {batchDeleteTarget.files.length} files? This action cannot be undone.
                <br />
                <br />
                Files to delete:
                <ul className="mt-2 text-sm list-disc list-inside">
                  {batchDeleteTarget.files.slice(0, 5).map(f => (
                    <li key={f.id}>{f.file_name}</li>
                  ))}
                  {batchDeleteTarget.files.length > 5 && (
                    <li>...and {batchDeleteTarget.files.length - 5} more</li>
                  )}
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    // Delete each file using the same API as single file delete
                    for (const file of batchDeleteTarget.files) {
                      const res = await fetch("/api/files/delete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id: file.id,
                          storageKey: file.storage_key,
                          ownerAccountId,
                        }),
                      });
                      if (!res.ok) {
                        const error = await res.json().catch(() => ({}));
                        throw new Error(error.error || "Failed to delete file");
                      }
                    }
                    
                    // Refresh the file list and clear selection
                    refreshFiles();
                    clearSelection();
                    setBatchDeleteTarget(null);
                  } catch (error) {
                    console.error("Batch delete failed:", error);
                  }
                }}
              >
                Delete {batchDeleteTarget.files.length} files
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
