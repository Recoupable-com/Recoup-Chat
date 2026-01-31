"use client";

import { useConnectorsBase } from "./useConnectorsBase";

// Re-export types from base
export type { ConnectorInfo as ArtistConnectorInfo } from "./useConnectorsBase";

/**
 * Hook for managing artist-specific connectors (e.g., TikTok).
 * Fetches connector status and provides authorize/disconnect functions.
 *
 * @param artistId - The artist ID to get connectors for (required)
 */
export function useArtistConnectors(artistId: string | undefined) {
  return useConnectorsBase({
    apiPath: "/api/artist-connectors",
    entityId: artistId,
    entityQueryParam: "artist_id",
    entityBodyParam: "artist_id",
  });
}
