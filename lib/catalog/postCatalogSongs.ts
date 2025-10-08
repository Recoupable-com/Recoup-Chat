import { CatalogSongsResponse } from "./getCatalogSongs";

export interface CatalogSongInput {
  catalog_id: string;
  isrc: string;
}

export interface PostCatalogSongsRequest {
  songs: CatalogSongInput[];
}

/**
 * Adds songs to a catalog by ISRC in batch
 */
export async function postCatalogSongs(
  songs: CatalogSongInput[]
): Promise<CatalogSongsResponse> {
  try {
    const response = await fetch(
      "https://api.recoupable.com/api/catalogs/songs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songs }),
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
    console.error("Error inserting catalog songs:", error);
    throw error;
  }
}
