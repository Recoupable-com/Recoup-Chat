"use client";

import { useState, useEffect, useCallback } from "react";
import { NEW_API_BASE_URL } from "@/lib/consts";
import { useAccessToken } from "@/hooks/useAccessToken";

/**
 * Artist connector info from the API.
 */
export interface ArtistConnectorInfo {
  slug: string;
  name: string;
  isConnected: boolean;
  connectedAccountId?: string;
}

/**
 * Hook for managing artist-specific connectors (e.g., TikTok).
 * Fetches connector status and provides authorize/disconnect functions.
 *
 * @param artistId - The artist ID to get connectors for (required)
 */
export function useArtistConnectors(artistId: string | undefined) {
  const accessToken = useAccessToken();

  const [connectors, setConnectors] = useState<ArtistConnectorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnectors = useCallback(async () => {
    if (!accessToken || !artistId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${NEW_API_BASE_URL}/api/artist-connectors?artist_id=${encodeURIComponent(artistId)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch artist connectors");
      }

      const data = await response.json();
      setConnectors(data.data.connectors);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, artistId]);

  const authorize = useCallback(
    async (connector: string): Promise<string | null> => {
      if (!accessToken || !artistId) return null;

      try {
        const response = await fetch(
          `${NEW_API_BASE_URL}/api/artist-connectors/authorize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ artist_id: artistId, connector }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to authorize artist connector");
        }

        const data = await response.json();
        return data.data.redirectUrl;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      }
    },
    [accessToken, artistId],
  );

  const disconnect = useCallback(
    async (connectedAccountId: string): Promise<boolean> => {
      if (!accessToken || !artistId) return false;

      try {
        const response = await fetch(
          `${NEW_API_BASE_URL}/api/artist-connectors`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              artist_id: artistId,
              connected_account_id: connectedAccountId,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to disconnect artist connector");
        }

        // Refresh the connectors list after disconnect
        await fetchConnectors();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      }
    },
    [accessToken, artistId, fetchConnectors],
  );

  const complete = useCallback(
    async (toolkitSlug: string): Promise<boolean> => {
      if (!accessToken || !artistId) return false;

      try {
        const response = await fetch(
          `${NEW_API_BASE_URL}/api/artist-connectors/complete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              artist_id: artistId,
              toolkit_slug: toolkitSlug,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to complete artist connector");
        }

        // Refresh the connectors list after completion
        await fetchConnectors();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      }
    },
    [accessToken, artistId, fetchConnectors],
  );

  useEffect(() => {
    fetchConnectors();
  }, [fetchConnectors]);

  return {
    connectors,
    isLoading,
    error,
    refetch: fetchConnectors,
    authorize,
    disconnect,
    complete,
  };
}
