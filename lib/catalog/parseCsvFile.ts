import { CatalogSongInput } from "./postCatalogSongs";

/**
 * Parses a CSV file containing catalog songs
 * Expected columns: isrc (case-insensitive)
 * catalog_id is provided as a parameter from the tool results
 */
export function parseCsvFile(
  text: string,
  catalogId: string
): CatalogSongInput[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV file must contain headers and at least one row");
  }

  // Parse header to find ISRC column (case-insensitive)
  const headers = lines[0].split(",").map((h) => h.trim());
  const isrcIndex = headers.findIndex(
    (header) => header.toLowerCase() === "isrc"
  );

  if (isrcIndex === -1) {
    throw new Error("CSV must contain an 'isrc' column (case-insensitive)");
  }

  // Parse data rows
  const songs: CatalogSongInput[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((cell) => cell.trim());
    if (row.length > isrcIndex && row[isrcIndex]) {
      songs.push({
        catalog_id: catalogId,
        isrc: row[isrcIndex],
      });
    }
  }

  return songs;
}
