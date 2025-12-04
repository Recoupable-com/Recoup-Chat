import { z } from "zod";
import { tool } from "ai";
import { NEW_API_BASE_URL } from "../consts";

/**
 * Types for Spotify Get Artist Top Tracks response
 */
export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyArtist {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

export interface SpotifyRestrictions {
  reason: string;
}

export interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: SpotifyRestrictions;
  type: "album";
  uri: string;
  artists: SpotifyArtist[];
}

export interface SpotifyExternalIds {
  isrc?: string;
  ean?: string;
  upc?: string;
}

export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: SpotifyExternalIds;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: Record<string, unknown>; // No details in docs, keep as unknown
  restrictions?: SpotifyRestrictions;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

export interface GetSpotifyArtistTopTracksResponse {
  tracks: SpotifyTrack[];
}

const schema = z.object({
  id: z.string().min(1, "Artist ID is required"),
  market: z.string().length(2).optional(),
});

const getSpotifyArtistTopTracks = tool({
  description:
    "Retrieve an artist's top tracks by country using the Spotify API. You should call get_artist_socials or get_spotify_search first in order to get an artist ID to use in the tool call.",
  inputSchema: schema,
  execute: async ({
    id,
    market,
  }): Promise<GetSpotifyArtistTopTracksResponse> => {
    try {
      const url = new URL(`${NEW_API_BASE_URL}/api/spotify/artist/topTracks`);
      url.searchParams.append("id", id);
      if (market) url.searchParams.append("market", market);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as GetSpotifyArtistTopTracksResponse;
      return data;
    } catch (error) {
      console.error("Error fetching artist top tracks:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch artist top tracks");
    }
  },
});

export default getSpotifyArtistTopTracks;
