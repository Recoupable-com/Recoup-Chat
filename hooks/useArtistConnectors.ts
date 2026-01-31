"use client";

import { useConnectorsBase } from "./useConnectorsBase";

// Re-export types from base
export type { ConnectorInfo as ArtistConnectorInfo } from "./useConnectorsBase";

/**
 * Hook for managing artist-specific connectors (e.g., TikTok).
 * Uses the unified /api/connectors endpoint with entity_type=artist.
 *
 * @param artistId - The artist ID to get connectors for (required)
 */
export function useArtistConnectors(artistId: string | undefined) {
  return useConnectorsBase({
    apiPath: "/api/connectors",
    entityId: artistId,
    entityQueryParam: "entity_id",
    entityBodyParam: "entity_id",
    // Additional query/body params for artist context
    extraQueryParams: { entity_type: "artist" },
    extraBodyParams: { entity_type: "artist" },
  });
}
