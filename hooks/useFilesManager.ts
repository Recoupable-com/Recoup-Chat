"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";

export interface ListedFileRow {
  id: string;
  file_name: string;
  mime_type: string | null;
}

export default function useFilesManager() {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();

  const ownerAccountId = useMemo(() => userData?.account_id || "", [userData]);
  const artistAccountId = useMemo(() => selectedArtist?.account_id || "", [selectedArtist]);

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<{ files: Array<ListedFileRow> }>({
    queryKey: ["files", ownerAccountId, artistAccountId],
    queryFn: async () => {
      const url = `/api/files/list?ownerAccountId=${ownerAccountId}&artistAccountId=${artistAccountId}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load files");
      return res.json();
    },
    enabled: Boolean(ownerAccountId && artistAccountId),
  });

  async function handleUpload() {
    if (!file) return;
    if (!ownerAccountId || !artistAccountId) {
      setStatus("Missing account or artist");
      return;
    }
    setStatus("Uploading...");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `files/${ownerAccountId}/${artistAccountId}/${safeName}`;

    const form = new FormData();
    form.append("key", key);
    form.append("file", file);

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
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      }),
    });
    const recJson = await rec.json();
    if (!rec.ok) {
      setStatus(`Error: ${recJson.error || rec.statusText}`);
      return;
    }

    setStatus("Uploaded");
    setFile(null);
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
  };
}


