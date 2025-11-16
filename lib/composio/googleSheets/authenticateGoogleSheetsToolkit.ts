import { getComposioClient } from "../client";

const authConfigId =
  process.env.NEXT_PUBLIC_COMPOSIO_GOOGLE_SHEETS_AUTH_CONFIG_ID;
if (!authConfigId) {
  throw new Error(
    "Missing COMPOSIO_GOOGLE_SHEETS_AUTH_CONFIG_ID environment variable"
  );
}

async function authenticateGoogleSheetsToolkit(userId: string) {
  console.log("SWEETS authenticateGoogleSheetsToolkit", userId);
  console.log("SWEETS authConfigId", authConfigId);
  const composio = await getComposioClient();
  console.log("SWEETS composio", composio);
  try {
    const connectionRequest = await composio.connectedAccounts.initiate(
      userId,
      authConfigId!
    );
    console.log(
      `SWEETS Visit this URL to authenticate Google Sheets: ${connectionRequest.redirectUrl}`
    );

    // This will wait for the auth flow to be completed
    await connectionRequest.waitForConnection();

    return connectionRequest.id;
  } catch (error) {
    console.error("SWEETS error", error);
    throw error;
  }
}

export default authenticateGoogleSheetsToolkit;
