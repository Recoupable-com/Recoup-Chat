import { ComposioToolkitKey, getToolkitConfig } from "./toolkits";

// Use environment variable for local development, otherwise use production URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_RECOUP_API_URL || "https://recoup-api.vercel.app";

interface FetchConnectedAccountsRefreshParams {
  accountId: string;
  redirectUrl: string;
}

interface FetchConnectedAccountsRefreshResponse {
  message: string;
  id: string;
  status: string;
  redirect_url: string;
}

/**
 * Call the Recoup-API to refresh a connected account and get OAuth URL.
 *
 * @param toolkitKey - The toolkit to refresh (e.g., "GOOGLE_SHEETS", "GOOGLE_DRIVE")
 * @param params - Account ID and redirect URL
 * @returns The refresh response with OAuth redirect URL
 */
export async function fetchConnectedAccountsRefresh(
  toolkitKey: ComposioToolkitKey,
  { accountId, redirectUrl }: FetchConnectedAccountsRefreshParams
): Promise<FetchConnectedAccountsRefreshResponse> {
  const config = getToolkitConfig(toolkitKey);

  const response = await fetch(`${API_BASE_URL}${config.refreshEndpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId,
      redirectUrl,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
