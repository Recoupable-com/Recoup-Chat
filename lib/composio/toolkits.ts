/**
 * Configuration for Composio toolkits.
 * Add new toolkits here to enable them across the application.
 *
 * This is the single source of truth for all Composio toolkit configurations.
 */
export const COMPOSIO_TOOLKITS = {
  GOOGLE_SHEETS: {
    slug: "GOOGLESHEETS",
    name: "Google Sheets",
    authConfigEnvVar: "COMPOSIO_GOOGLE_SHEETS_AUTH_CONFIG_ID",
    refreshEndpoint: "/api/connectedAccounts/googleSheets/refresh",
    loginToolName: "googleSheetsLoginTool",
    description: "reading and writing to spreadsheets",
  },
  GOOGLE_DRIVE: {
    slug: "GOOGLEDRIVE",
    name: "Google Drive",
    authConfigEnvVar: "COMPOSIO_GOOGLE_DRIVE_AUTH_CONFIG_ID",
    refreshEndpoint: "/api/connectedAccounts/googleDrive/refresh",
    loginToolName: "googleDriveLoginTool",
    description: "uploading, downloading, and managing files",
  },
} as const;

export type ComposioToolkitKey = keyof typeof COMPOSIO_TOOLKITS;
export type ComposioToolkit = (typeof COMPOSIO_TOOLKITS)[ComposioToolkitKey];

/**
 * Get toolkit configuration by key.
 */
export function getToolkitConfig(key: ComposioToolkitKey): ComposioToolkit {
  return COMPOSIO_TOOLKITS[key];
}

/**
 * Get the auth config ID for a toolkit from environment variables.
 */
export function getToolkitAuthConfigId(key: ComposioToolkitKey): string {
  const config = COMPOSIO_TOOLKITS[key];
  const authConfigId = process.env[config.authConfigEnvVar];

  if (!authConfigId) {
    throw new Error(
      `${config.authConfigEnvVar} not found in environment variables`
    );
  }

  return authConfigId;
}
