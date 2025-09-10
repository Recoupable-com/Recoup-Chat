"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";

export interface ListedFileRow {
  id: string;
  file_name: string;
  mime_type: string | null;
  is_directory?: boolean;
}

export default function useFilesManager(activePath?: string) {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();

  const ownerAccountId = useMemo(() => userData?.account_id || "", [userData]);
  const artistAccountId = useMemo(() => selectedArtist?.account_id || "", [selectedArtist]);

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<{ files: Array<ListedFileRow> }>({
    queryKey: ["files", ownerAccountId, artistAccountId, activePath],
    queryFn: async () => {
      const p = activePath ? `&path=${encodeURIComponent(activePath)}` : "";
      const url = `/api/files/list?ownerAccountId=${ownerAccountId}&artistAccountId=${artistAccountId}${p}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load files");
      return res.json();
    },
    enabled: Boolean(ownerAccountId && artistAccountId),
  });

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/files/folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerAccountId, artistAccountId, name, parentPath: activePath || `files/${ownerAccountId}/${artistAccountId}/` }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create folder");
      return json.folder as ListedFileRow;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["files", ownerAccountId, artistAccountId] });
    },
  });

  async function handleUpload(selectedFile?: File) {
    const targetFile = selectedFile || file;
    if (!targetFile) return;
    if (!ownerAccountId || !artistAccountId) {
      setStatus("Missing account or artist");
      return;
    }
    setStatus("Uploading...");

    const safeName = targetFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `files/${ownerAccountId}/${artistAccountId}/${safeName}`;

    const form = new FormData();
    form.append("key", key);
    form.append("file", targetFile);

    const up = await fetch("/api/storage/upload-by-key", { method: "POST", body: form });
    const upJson = await up.json();
    if (!up.ok) {
      setStatus(`Error: ${upJson.error || up.statusText}`);
      return;
    }

    const rec = await fetch("/api/files/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerAccountId,
        artistAccountId,
        storageKey: upJson.path || key,
        fileName: targetFile.name,
        mimeType: targetFile.type,
        sizeBytes: targetFile.size,
      }),
    });
    const recJson = await rec.json();
    if (!rec.ok) {
      setStatus(`Error: ${recJson.error || rec.statusText}`);
      return;
    }

    setStatus("Uploaded");
    if (!selectedFile) setFile(null);
    await qc.invalidateQueries({ queryKey: ["files", ownerAccountId, artistAccountId] });
  }

  return {
    ownerAccountId,
    artistAccountId,
    file,
    setFile,
    status,
    setStatus,
    isLoading,
    files: data?.files || [],
    handleUpload,
    createFolder: (name: string) => createFolderMutation.mutateAsync(name),
  };
}


