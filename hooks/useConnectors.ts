"use client";

import { useState, useEffect, useCallback } from "react";
import { NEW_API_BASE_URL } from "@/lib/consts";
import { useAccessToken } from "@/hooks/useAccessToken";

/**
 * Connector info from the API.
 */
export interface ConnectorInfo {
  slug: string;
  name: string;
  isConnected: boolean;
  connectedAccountId?: string;
}

/**
 * Internal connectors hidden from end users.
 * These are developer tools or infrastructure connectors.
 */
const HIDDEN_CONNECTORS = [
  "composio",
  "supabase",
  "perplexityai",
  "codeinterpreter",
  "serpapi",
  "firecrawl",
];

/**
 * Hook for managing connectors.
 * Fetches connector status and provides authorize function.
 */
export function useConnectors() {
  const accessToken = useAccessToken();

  const [connectors, setConnectors] = useState<ConnectorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnectors = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${NEW_API_BASE_URL}/api/connectors`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch connectors");
      }

      const data = await response.json();
      const visible = data.data.connectors.filter(
        (c: ConnectorInfo) => !HIDDEN_CONNECTORS.includes(c.slug.toLowerCase()),
      );
      setConnectors(visible);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  const authorize = useCallback(
    async (connector: string): Promise<string | null> => {
      if (!accessToken) return null;

      try {
        const response = await fetch(
          `${NEW_API_BASE_URL}/api/connectors/authorize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ connector }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to authorize connector");
        }

        const data = await response.json();
        return data.data.redirectUrl;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      }
    },
    [accessToken],
  );

  const disconnect = useCallback(
    async (connectedAccountId: string): Promise<boolean> => {
      if (!accessToken) return false;

      try {
        const response = await fetch(`${NEW_API_BASE_URL}/api/connectors`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ connected_account_id: connectedAccountId }),
        });

        if (!response.ok) {
          throw new Error("Failed to disconnect connector");
        }

        // Refresh the connectors list after disconnect
        await fetchConnectors();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      }
    },
    [accessToken, fetchConnectors],
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
  };
}
