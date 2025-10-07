import { getCatalogSongs } from "./getCatalogSongs";
import { formatCatalogSongsAsCSV } from "./formatCatalogSongsAsCSV";

/**
 * Gets all catalog songs and formats them as CSV for the scorer
 */
export async function getCatalogDataAsCSV(catalogId: string): Promise<string> {
  const songs = await getCatalogSongs(catalogId);
  return formatCatalogSongsAsCSV(songs);
}
