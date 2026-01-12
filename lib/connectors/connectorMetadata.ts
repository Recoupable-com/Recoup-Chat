/**
 * Metadata for each connector.
 * Provides descriptions for the connectors page.
 */

export interface ConnectorMeta {
  description: string;
}

/**
 * Metadata map for all supported connectors.
 * Keys are connector slugs (lowercase).
 */
export const connectorMetadata: Record<string, ConnectorMeta> = {
  // Google Suite
  googlesheets: { description: "Read, create, and update spreadsheets" },
  googledrive: { description: "Access and manage your files and folders" },
  googledocs: { description: "Create and edit documents" },
  googlecalendar: { description: "Manage events and schedules" },
  gmail: { description: "Search, read, and send emails" },

  // Communication
  slack: { description: "Post messages across your workspace" },
  outlook: { description: "Search your emails and calendar events" },

  // Productivity
  notion: { description: "Search and create content on your pages" },
  airtable: { description: "Manage bases, tables, and records" },
  linear: { description: "Track projects, issues, and workflows" },
  jira: { description: "Manage projects and track issues" },
  hubspot: { description: "Manage contacts and CRM data" },

  // Development
  github: { description: "Manage repositories, issues, and PRs" },

  // Social
  twitter: { description: "Post and manage tweets" },
};

/**
 * Get metadata for a connector by slug.
 * Returns default values if not found.
 */
export function getConnectorMeta(slug: string): ConnectorMeta {
  return (
    connectorMetadata[slug.toLowerCase()] || {
      description: "Connect to enable this connector",
    }
  );
}
