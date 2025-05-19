import { z } from "zod";
import { tool } from "ai";

export interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: { url: string; height: number | null; width: number | null }[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: { reason: string };
  type: string;
  uri: string;
  artists: {
    external_urls: { spotify: string };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }[];
  tracks: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: any[];
  };
  copyrights: { text: string; type: string }[];
  external_ids: { isrc?: string; ean?: string; upc?: string };
  genres: string[];
  label: string;
  popularity: number;
}

const schema = z.object({
  id: z.string().min(1, "Album ID is required"),
  market: z
    .string()
    .length(2)
    .optional()
    .describe("ISO 3166-1 alpha-2 country code"),
});

const getSpotifyAlbum = tool({
  description:
    "Retrieve Spotify catalog information for a single album. You should call get_spotify_artist_albums or get_spotify_search first in order to get an album ID to use in the tool call.",
  parameters: schema,
  execute: async ({ id, market }): Promise<SpotifyAlbum> => {
    const url = new URL("https://api.recoupable.com/api/spotify/album");
    url.searchParams.append("id", id);
    if (market) url.searchParams.append("market", market);

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return (await response.json()) as SpotifyAlbum;
    } catch (error) {
      console.error("Error fetching Spotify album:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch Spotify album");
    }
  },
});

export default getSpotifyAlbum;
