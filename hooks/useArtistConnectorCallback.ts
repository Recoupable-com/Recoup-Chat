"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { NEW_API_BASE_URL } from "@/lib/consts";
import { useAccessToken } from "@/hooks/useAccessToken";

/**
 * Hook to handle OAuth callback for artist connectors.
 *
 * Detects ?artist_connected={artistId}&toolkit={slug} query params
 * and completes the OAuth flow by storing the connection.
 *
 * @returns Object with success state for showing toast
 */
export function useArtistConnectorCallback() {
  const searchParams = useSearchParams();
  const accessToken = useAccessToken();

  const [showSuccess, setShowSuccess] = useState(false);
  const [connectedToolkit, setConnectedToolkit] = useState<string | null>(null);

  const completeConnection = useCallback(
    async (artistId: string, toolkitSlug: string): Promise<boolean> => {
      if (!accessToken) return false;

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

        return response.ok;
      } catch {
        return false;
      }
    },
    [accessToken],
  );

  useEffect(() => {
    const artistId = searchParams.get("artist_connected");
    const toolkit = searchParams.get("toolkit");

    if (artistId && toolkit && accessToken) {
      // Complete the OAuth flow
      completeConnection(artistId, toolkit).then((success) => {
        if (success) {
          setShowSuccess(true);
          setConnectedToolkit(toolkit);

          // Clear URL params after handling
          window.history.replaceState({}, "", "/chat");

          // Hide success after 5 seconds
          const timer = setTimeout(() => setShowSuccess(false), 5000);
          return () => clearTimeout(timer);
        }
      });
    }
  }, [searchParams, accessToken, completeConnection]);

  return {
    showSuccess,
    connectedToolkit,
  };
}
