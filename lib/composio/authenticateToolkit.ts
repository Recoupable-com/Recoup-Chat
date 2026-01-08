import { CreateConnectedAccountOptions } from "@composio/core";
import { getComposioClient } from "./client";
import { ComposioToolkitKey, getToolkitAuthConfigId } from "./toolkits";

/**
 * Initiate OAuth authentication for a Composio toolkit.
 *
 * @param toolkitKey - The toolkit to authenticate (e.g., "GOOGLE_SHEETS", "GOOGLE_DRIVE")
 * @param userId - The user ID to authenticate
 * @param options - Optional callback URL and other options
 * @returns The connection request from Composio
 */
export async function authenticateToolkit(
  toolkitKey: ComposioToolkitKey,
  userId: string,
  options?: CreateConnectedAccountOptions
) {
  const authConfigId = getToolkitAuthConfigId(toolkitKey);
  const composio = await getComposioClient();

  const connectionRequest = await composio.connectedAccounts.initiate(
    userId,
    authConfigId,
    options
  );

  return connectionRequest;
}
