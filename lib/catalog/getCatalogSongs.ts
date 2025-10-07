/**
 * Fetches all songs from a catalog by iterating through all pages
 * until all songs have been retrieved
 */

import { Tables } from "@/types/database.types";

// Use types from database.types.ts
type Song = Tables<"songs">;
type Account = Tables<"accounts">;

type CatalogSong = Song & {
  catalog_id: string;
  artists: Array<Pick<Account, "id" | "name" | "timestamp">>;
};

interface CatalogSongsResponse {
  status: string;
  songs: CatalogSong[];
  pagination: {
    total_count: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  error?: string;
}

export async function getCatalogSongs(
  catalogId: string,
  pageSize: number = 100
): Promise<CatalogSong[]> {
  const allSongs: CatalogSong[] = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    do {
      // Build query parameters
      const params = new URLSearchParams({
        catalog_id: catalogId,
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      const response = await fetch(
        `https://api.recoupable.com/api/catalogs/songs?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: CatalogSongsResponse = await response.json();

      if (data.status === "error") {
        throw new Error(data.error || "Unknown error occurred");
      }

      // Add songs from this page to our collection
      allSongs.push(...data.songs);

      // Update pagination info
      totalPages = data.pagination.total_pages;
      currentPage++;
    } while (currentPage <= totalPages);

    return allSongs;
  } catch (error) {
    console.error("Error fetching catalog songs:", error);
    throw error;
  }
}
