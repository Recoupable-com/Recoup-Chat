"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Hook to handle OAuth callback for artist connectors.
 *
 * Detects ?artist_connected={artistId}&toolkit={slug} query params
 * and shows a success message. No API call needed since Composio
 * stores the connection under the artistId entity automatically.
 *
 * @returns Object with success state for showing toast
 */
export function useArtistConnectorCallback() {
  const searchParams = useSearchParams();

  const [showSuccess, setShowSuccess] = useState(false);
  const [connectedToolkit, setConnectedToolkit] = useState<string | null>(null);

  useEffect(() => {
    const artistId = searchParams.get("artist_connected");
    const toolkit = searchParams.get("toolkit");

    if (artistId && toolkit) {
      // Connection completed - Composio stores it under artistId entity
      setShowSuccess(true);
      setConnectedToolkit(toolkit);

      // Clear URL params after handling
      window.history.replaceState({}, "", "/chat");

      // Hide success after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return {
    showSuccess,
    connectedToolkit,
  };
}
