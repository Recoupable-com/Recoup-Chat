import { useMutation } from "@tanstack/react-query";
import { parseCsvFile } from "@/lib/catalog/parseCsvFile";
import { postCatalogSongs } from "@/lib/catalog/postCatalogSongs";
import { CatalogSongsResponse } from "@/lib/catalog/getCatalogSongs";

export interface UploadResult {
  success: boolean;
  songs: CatalogSongsResponse["songs"];
  pagination: CatalogSongsResponse["pagination"];
  total_added: number;
  message: string;
}

export function useCatalogSongsFileSelect(catalogId?: string) {
  const mutation = useMutation({
    mutationFn: async (file: File): Promise<UploadResult> => {
      if (!catalogId) {
        throw new Error("No catalog selected. Please select a catalog first.");
      }

      const text = await file.text();
      const songs = parseCsvFile(text, catalogId);

      if (songs.length === 0) {
        throw new Error("No valid songs found in CSV file");
      }

      const response = await postCatalogSongs(songs);

      return {
        success: true,
        songs: response.songs,
        pagination: response.pagination,
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
    handleFileSelect,
  };
}
