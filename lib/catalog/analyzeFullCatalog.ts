import { getCatalogSongs, type CatalogSong } from "./getCatalogSongs";
import { analyzeCatalogBatch } from "./analyzeCatalogBatch";

const BATCH_SIZE = 100;

export interface AnalyzeFullCatalogOptions {
  catalogId: string;
  criteria: string;
}

/**
 * Fetches all songs from a catalog and filters them using AI in parallel batches
 * Following Open-Closed Principle: open for extension (custom filtering logic), closed for modification
 */
export async function analyzeFullCatalog({
  catalogId,
  criteria,
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

    return analyzeCatalogBatch(pageData.songs, criteria);
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
