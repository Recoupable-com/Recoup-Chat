/**
 * Fetches a single page of songs from a catalog
 */

import { Tables } from "@/types/database.types";

type Song = Tables<"songs">;
type Account = Tables<"accounts">;

export type CatalogSong = Song & {
  catalog_id: string;
  artists: Array<Pick<Account, "id" | "name" | "timestamp">>;
};

export interface CatalogSongsResponse {
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
  pageSize: number = 100,
  page: number = 1
): Promise<CatalogSongsResponse> {
  try {
    const params = new URLSearchParams({
      catalog_id: catalogId,
      page: page.toString(),
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

    return data;
  } catch (error) {
    console.error("Error fetching catalog songs:", error);
    throw error;
  }
}
