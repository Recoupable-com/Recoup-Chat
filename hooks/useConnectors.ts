"use client";

import { useConnectorsBase } from "./useConnectorsBase";

// Re-export types from base
export type { ConnectorInfo } from "./useConnectorsBase";

/**
 * Connectors visible to end users.
 * Only these connectors will be shown on the settings page.
 */
const ALLOWED_CONNECTORS = ["googlesheets", "googledrive", "googledocs"];

/**
 * Hook for managing user-level connectors.
 * Fetches connector status and provides authorize/disconnect functions.
 */
export function useConnectors() {
  return useConnectorsBase({
    apiPath: "/api/connectors",
    allowedSlugs: ALLOWED_CONNECTORS,
  });
}
