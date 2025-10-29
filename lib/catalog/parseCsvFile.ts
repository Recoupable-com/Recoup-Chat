import { CatalogSongInput } from "./postCatalogSongs";

/**
 * Parses a CSV file containing catalog songs
 * Required columns: isrc (case-insensitive)
 * Optional columns: name, album, notes (case-insensitive)
 * catalog_id is provided as a parameter
 */
export function parseCsvFile(
  text: string,
  catalogId: string
): CatalogSongInput[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV file must contain headers and at least one row");
  }

  // Parse headers and find column indices (case-insensitive)
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const isrcIndex = headers.indexOf("isrc");
  const nameIndex = headers.indexOf("name");
  const albumIndex = headers.indexOf("album");
  const notesIndex = headers.indexOf("notes");

  if (isrcIndex === -1) {
    throw new Error("CSV must contain an 'isrc' column (case-insensitive)");
  }

  // Parse data rows
  const songs: CatalogSongInput[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((cell) => cell.trim());

    // Skip rows without ISRC
    if (!row[isrcIndex]) {
      continue;
    }

    songs.push({
      catalog_id: catalogId,
      isrc: row[isrcIndex],
      name: nameIndex !== -1 ? row[nameIndex] || undefined : undefined,
      album: albumIndex !== -1 ? row[albumIndex] || undefined : undefined,
      notes: notesIndex !== -1 ? row[notesIndex] || undefined : undefined,
    });
  }

  return songs;
}
