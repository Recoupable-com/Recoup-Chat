import { postCatalogSongs, CatalogSongInput } from "./postCatalogSongs";

const BATCH_SIZE = 1000;

export const uploadBatchSongs = async (
  songs: CatalogSongInput[],
  onProgress?: (current: number, total: number) => void
) => {
  const batches = [];
  for (let i = 0; i < songs.length; i += BATCH_SIZE) {
    batches.push(songs.slice(i, i + BATCH_SIZE));
  }

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    onProgress?.(i + 1, batches.length);
    await postCatalogSongs(batch);
  }
};
