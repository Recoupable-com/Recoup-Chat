import { getComposioClient } from "../client";

const googleSheetsAuthConfigId = process.env
  ?.COMPOSIO_GOOGLE_SHEETS_AUTH_CONFIG_ID as string;
if (!googleSheetsAuthConfigId) {
  throw new Error(
    "COMPOSIO_GOOGLE_SHEETS_AUTH_CONFIG_ID not found in environment variables"
  );
}

async function authenticateGoogleSheetsToolkit(userId: string) {
  const composio = await getComposioClient();
  const connectionRequest = await composio.connectedAccounts.initiate(
    userId,
    googleSheetsAuthConfigId
  );
  return connectionRequest;
}

export default authenticateGoogleSheetsToolkit;

