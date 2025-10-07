import { Tables } from "@/types/database.types";

// Use types from database.types.ts
type Song = Tables<"songs">;
type Account = Tables<"accounts">;

type CatalogSong = Song & {
  catalog_id: string;
  artists: Array<Pick<Account, "id" | "name" | "timestamp">>;
};

/**
 * Formats catalog songs into the CSV-like format expected by the scorer
 */
export function formatCatalogSongsAsCSV(songs: CatalogSong[]): string {
  const csvLines = songs.map((song) => {
    const artistNames = song.artists.map((artist) => artist.name).join(", ");
    return `${song.isrc},"${song.name}","${song.album}","${artistNames}"`;
  });

  return csvLines.join("\n");
}
