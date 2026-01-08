import { CreateConnectedAccountOptions } from "@composio/core";
import { getComposioClient } from "./client";
import { authenticateToolkit } from "./authenticateToolkit";
import { ComposioToolkitKey, getToolkitConfig } from "./toolkits";

/**
 * Get a user's connected account for a Composio toolkit.
 * If no connection exists, initiates the authentication flow.
 *
 * @param toolkitKey - The toolkit to check (e.g., "GOOGLE_SHEETS", "GOOGLE_DRIVE")
 * @param accountId - The user's account ID
 * @param options - Optional callback URL and other options
 * @returns The user's connected accounts for this toolkit
 */
export async function getConnectedAccount(
  toolkitKey: ComposioToolkitKey,
  accountId: string,
  options?: CreateConnectedAccountOptions
) {
  const config = getToolkitConfig(toolkitKey);
  const composio = await getComposioClient();

  let userAccounts = await composio.connectedAccounts.list({
    userIds: [accountId],
    toolkitSlugs: [config.slug],
  });

  if (userAccounts.items.length === 0) {
    await authenticateToolkit(toolkitKey, accountId, options);
    userAccounts = await composio.connectedAccounts.list({
      userIds: [accountId],
      toolkitSlugs: [config.slug],
    });
  }

  return userAccounts;
}

/**
 * Check if a user has an active connection for a toolkit.
 */
export function isConnectionActive(
  userAccounts: Awaited<ReturnType<typeof getConnectedAccount>>
): boolean {
  return userAccounts.items[0]?.data?.status === "ACTIVE";
}
