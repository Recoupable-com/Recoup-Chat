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
  // Available now
  googlesheets: { description: "Read, create, and update spreadsheets" },

  // Coming soon - Google Suite
  googledrive: {
    description: "Access and manage your files and folders",
    comingSoon: true,
  },
  googledocs: { description: "Create and edit documents", comingSoon: true },
  googlecalendar: { description: "Manage events and schedules", comingSoon: true },
  gmail: { description: "Search, read, and send emails", comingSoon: true },

  // Coming soon - Communication
  slack: { description: "Post messages across your workspace", comingSoon: true },
  outlook: {
    description: "Search your emails and calendar events",
    comingSoon: true,
  },

  // Coming soon - Productivity
  notion: {
    description: "Search and create content on your pages",
    comingSoon: true,
  },
  airtable: { description: "Manage bases, tables, and records", comingSoon: true },
  linear: {
    description: "Track projects, issues, and workflows",
    comingSoon: true,
  },
  jira: { description: "Manage projects and track issues", comingSoon: true },
  hubspot: { description: "Manage contacts and CRM data", comingSoon: true },

  // Coming soon - Development
  github: { description: "Manage repositories, issues, and PRs", comingSoon: true },

  // Coming soon - Social
  twitter: { description: "Post and manage tweets", comingSoon: true },
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
