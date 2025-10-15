import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { parseCsvFile } from "@/lib/catalog/parseCsvFile";
import {
  postCatalogSongs,
  CatalogSongInput,
} from "@/lib/catalog/postCatalogSongs";
import {
  CatalogSongsResponse,
  getCatalogSongs,
} from "@/lib/catalog/getCatalogSongs";

export interface UploadResult {
  success: boolean;
  songs: CatalogSongsResponse["songs"];
  pagination: CatalogSongsResponse["pagination"];
  total_added: number;
  message: string;
}

const BATCH_SIZE = 1000;

const uploadInBatches = async (
  songs: CatalogSongInput[],
  onProgress?: (current: number, total: number) => void
) => {
  const batches = [];
  for (let i = 0; i < songs.length; i += BATCH_SIZE) {
    batches.push(songs.slice(i, i + BATCH_SIZE));
  }

  console.log(
    `SWEETS UPLOADING ${songs.length} songs in ${batches.length} batch(es)`
  );

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(
      `SWEETS UPLOADING BATCH ${i + 1}/${batches.length} (${batch.length} songs)`
    );
    onProgress?.(i + 1, batches.length);
    await postCatalogSongs(batch);
  }
};

export function useCatalogSongsFileSelect(catalogId?: string) {
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const mutation = useMutation({
    mutationFn: async (file: File): Promise<UploadResult> => {
      if (!catalogId) {
        throw new Error("No catalog selected. Please select a catalog first.");
      }

      const text = await file.text();
      const songs = parseCsvFile(text, catalogId);
      console.log("SWEETS SONGS: ", songs);

      if (songs.length === 0) {
        throw new Error("No valid songs found in CSV file");
      }

      await uploadInBatches(songs, (current, total) => {
        setUploadProgress({ current, total });
      });

      const catalogSongs = await getCatalogSongs(catalogId);
      console.log("SWEETS CATALOG SONGS: ", catalogSongs);

      setUploadProgress({ current: 0, total: 0 });

      return {
        success: true,
        songs: catalogSongs.songs,
        pagination: catalogSongs.pagination,
        total_added: songs.length,
        message: `Successfully uploaded ${songs.length} song(s) from CSV`,
      };
    },
  });

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await mutation.mutateAsync(file);
    event.target.value = "";
  };

  return {
    isUploading: mutation.isPending,
    uploadResult: mutation.data ?? null,
    uploadError: mutation.error?.message ?? null,
    uploadProgress,
    handleFileSelect,
  };
}
