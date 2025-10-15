import { z } from "zod";
import { generateObject } from "ai";
import { getCatalogSongs, type CatalogSong } from "./getCatalogSongs";
import { DEFAULT_MODEL } from "@/lib/consts";

const BATCH_SIZE = 100;

export interface AnalyzeFullCatalogOptions {
  catalogId: string;
  criteria: string;
  filterSongs: (songs: CatalogSong[], selectedIds: string[]) => CatalogSong[];
}

/**
 * Fetches all songs from a catalog and filters them using AI in parallel batches
 * Following Open-Closed Principle: open for extension (custom filtering logic), closed for modification
 */
export async function analyzeFullCatalog({
  catalogId,
  criteria,
  filterSongs,
}: AnalyzeFullCatalogOptions): Promise<{
  results: CatalogSong[];
  totalSongs: number;
  totalPages: number;
}> {
  // Fetch first page to get total count
  const firstPage = await getCatalogSongs(catalogId, BATCH_SIZE, 1);
  const totalPages = firstPage.pagination.total_pages;
  const totalSongs = firstPage.pagination.total_count;

  // Create array of page numbers to fetch
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Process all pages in parallel
  const batchPromises = pageNumbers.map(async (pageNum) => {
    const pageData =
      pageNum === 1
        ? firstPage
        : await getCatalogSongs(catalogId, BATCH_SIZE, pageNum);

    // Use AI to select relevant songs from this batch
    const { object } = await generateObject({
      model: DEFAULT_MODEL,
      schema: z.object({
        selected_song_isrcs: z
          .array(z.string())
          .describe("Array of song ISRCs that match the criteria"),
      }),
      prompt: `Given these songs and the criteria: "${criteria}", select the song ISRCs that are most relevant.
          
Songs:
${JSON.stringify(
  pageData.songs.map((s) => ({
    isrc: s.isrc,
    name: s.name,
    artist: s.artists.map((a) => a.name).join(", "),
  })),
  null,
  2
)}

Return only the ISRCs of songs that match the criteria.`,
    });

    // Filter songs based on AI selection
    return filterSongs(pageData.songs, object.selected_song_isrcs as string[]);
  });

  // Wait for all batches to complete
  const batchResults = await Promise.all(batchPromises);
  const results = batchResults.flat();

  return {
    results,
    totalSongs,
    totalPages,
  };
}
