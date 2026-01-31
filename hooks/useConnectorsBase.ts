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
 * Configuration for the connectors hook.
 */
export interface UseConnectorsConfig {
  /**
   * Base API path (e.g., "/api/connectors" or "/api/artist-connectors")
   */
  apiPath: string;
  /**
   * Entity ID to pass in requests (e.g., artistId for artist connectors)
   */
  entityId?: string;
  /**
   * Query param name for entity ID (e.g., "artist_id")
   */
  entityQueryParam?: string;
  /**
   * Body param name for entity ID (e.g., "artist_id")
   */
  entityBodyParam?: string;
  /**
   * Client-side filter for allowed connector slugs
   */
  allowedSlugs?: string[];
}

/**
 * Base hook for managing connectors (user or artist).
 * Provides fetchConnectors, authorize, and disconnect methods.
 *
 * @param config - Configuration for API paths and entity handling
 */
export function useConnectorsBase(config: UseConnectorsConfig) {
  const {
    apiPath,
    entityId,
    entityQueryParam,
    entityBodyParam,
    allowedSlugs,
  } = config;

  const accessToken = useAccessToken();

  const [connectors, setConnectors] = useState<ConnectorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnectors = useCallback(async () => {
    // If entityId is required but not provided, don't fetch
    if (!accessToken || (entityQueryParam && !entityId)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build URL with optional entity query param
      let url = `${NEW_API_BASE_URL}${apiPath}`;
      if (entityQueryParam && entityId) {
        url += `?${entityQueryParam}=${encodeURIComponent(entityId)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch connectors");
      }

      const data = await response.json();
      let result = data.data.connectors as ConnectorInfo[];

      // Apply client-side filter if provided
      if (allowedSlugs) {
        result = result.filter((c) =>
          allowedSlugs.includes(c.slug.toLowerCase()),
        );
      }

      setConnectors(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, apiPath, entityId, entityQueryParam, allowedSlugs]);

  const authorize = useCallback(
    async (connector: string): Promise<string | null> => {
      if (!accessToken || (entityBodyParam && !entityId)) return null;

      try {
        const body: Record<string, string> = { connector };
        if (entityBodyParam && entityId) {
          body[entityBodyParam] = entityId;
        }

        const response = await fetch(`${NEW_API_BASE_URL}${apiPath}/authorize`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        });

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
    [accessToken, apiPath, entityId, entityBodyParam],
  );

  const disconnect = useCallback(
    async (connectedAccountId: string): Promise<boolean> => {
      if (!accessToken || (entityBodyParam && !entityId)) return false;

      try {
        const body: Record<string, string> = {
          connected_account_id: connectedAccountId,
        };
        if (entityBodyParam && entityId) {
          body[entityBodyParam] = entityId;
        }

        const response = await fetch(`${NEW_API_BASE_URL}${apiPath}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
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
    [accessToken, apiPath, entityId, entityBodyParam, fetchConnectors],
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
