/**
 * Metadata for each connector.
 * Provides descriptions and availability status.
 */

export interface ConnectorMeta {
  description: string;
  comingSoon?: boolean;
}

/**
 * Metadata map for all supported connectors.
 * Keys are connector slugs (lowercase).
 */
export const connectorMetadata: Record<string, ConnectorMeta> = {
  googlesheets: { description: "Read, create, and update spreadsheets" },
};

/**
 * Get metadata for a connector by slug.
 * Returns default values if not found.
 */
export function getConnectorMeta(slug: string): ConnectorMeta {
  return (
    connectorMetadata[slug.toLowerCase()] || {
      description: "Connect to enable this connector",
      comingSoon: true,
    }
  );
}
