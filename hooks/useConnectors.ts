"use client";

import { useState, useEffect, useCallback } from "react";
import { NEW_API_BASE_URL } from "@/lib/consts";
import { useUserProvider } from "@/providers/UserProvder";

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
  const { userData } = useUserProvider();
  const accountId = userData?.account_id;

  const [connectors, setConnectors] = useState<ConnectorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnectors = useCallback(async () => {
    if (!accountId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${NEW_API_BASE_URL}/api/connectors?account_id=${accountId}`,
      );

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
  }, [accountId]);

  const authorize = useCallback(
    async (connector: string): Promise<string | null> => {
      if (!accountId) return null;

      try {
        const response = await fetch(
          `${NEW_API_BASE_URL}/api/connectors/authorize`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              account_id: accountId,
              connector,
            }),
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
    [accountId],
  );

  const disconnect = useCallback(
    async (connectedAccountId: string): Promise<boolean> => {
      try {
        const response = await fetch(
          `${NEW_API_BASE_URL}/api/connectors/disconnect`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              connected_account_id: connectedAccountId,
            }),
          },
        );

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
    [fetchConnectors],
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
