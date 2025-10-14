import { CatalogSongInput } from "./postCatalogSongs";

/**
 * Parses a CSV file containing catalog songs
 * Expected columns: catalog_id, isrc
 */
export function parseCsvFile(text: string): CatalogSongInput[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV file must contain headers and at least one row");
  }

  // Parse header to find column indices
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const catalogIdIndex = headers.indexOf("catalog_id");
  const isrcIndex = headers.indexOf("isrc");

  if (catalogIdIndex === -1 || isrcIndex === -1) {
    throw new Error("CSV must contain 'catalog_id' and 'isrc' columns");
  }

  // Parse data rows
  const songs: CatalogSongInput[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((cell) => cell.trim());
    if (row.length > Math.max(catalogIdIndex, isrcIndex)) {
      songs.push({
        catalog_id: row[catalogIdIndex],
        isrc: row[isrcIndex],
      });
    }
  }

  return songs;
}
