import { z } from "zod";
import { tool } from "ai";
import { NEW_API_BASE_URL } from "../consts";

// Types for the API response based on Recoup docs
export interface SimplifiedArtist {
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

export interface SimplifiedAlbum {
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  available_markets: string[];
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: { url: string; height: number; width: number }[];
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  restrictions?: { reason: string };
  type: "album";
  uri: string;
  artists: SimplifiedArtist[];
  album_group?: "album" | "single" | "compilation" | "appears_on";
}

export interface ArtistAlbumsResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SimplifiedAlbum[];
}

// Zod schema for parameter validation
const schema = z.object({
  id: z.string().min(1, "Artist ID is required"),
  include_groups: z
    .string()
    .optional()
    .describe(
      "Comma separated values of album types: album, single, appears_on, compilation"
    ),
  market: z
    .string()
    .length(2)
    .optional()
    .describe("ISO 3166-1 alpha-2 country code"),
  limit: z.number().min(1).max(50).optional().default(20),
  offset: z.number().min(0).optional().default(0),
});

const getSpotifyArtistAlbums = tool({
  description:
    "Retrieve Spotify catalog information about an artist's albums. You should call get_artist_socials or get_spotify_search first to obtain the artist ID before using this tool.",
  inputSchema: schema,
  execute: async ({
    id,
    include_groups,
    market,
    limit = 20,
    offset = 0,
  }): Promise<ArtistAlbumsResponse> => {
    const url = new URL(`${NEW_API_BASE_URL}/api/spotify/artist/albums`);
    url.searchParams.append("id", id);
    if (include_groups)
      url.searchParams.append("include_groups", include_groups);
    if (market) url.searchParams.append("market", market);
    if (limit) url.searchParams.append("limit", limit.toString());
    if (offset) url.searchParams.append("offset", offset.toString());

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return (await response.json()) as ArtistAlbumsResponse;
    } catch (error) {
      console.error("Error fetching Spotify artist albums:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch Spotify artist albums");
    }
  },
});

export default getSpotifyArtistAlbums;
