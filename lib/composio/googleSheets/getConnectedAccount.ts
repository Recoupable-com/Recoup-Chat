import { getComposioClient } from "@/lib/composio/client";
import authenticateGoogleSheetsToolkit from "./authenticateGoogleSheetsToolkit";

export const GOOGLE_SHEETS_TOOLKIT_SLUG = "GOOGLESHEETS";

export default async function getConnectedAccount(accountId: string) {
  const composio = await getComposioClient();
  let userAccounts = await composio.connectedAccounts.list({
    userIds: [accountId],
    toolkitSlugs: [GOOGLE_SHEETS_TOOLKIT_SLUG],
  });

  if (userAccounts.items.length === 0) {
    await authenticateGoogleSheetsToolkit(accountId);
    userAccounts = await composio.connectedAccounts.list({
      userIds: [accountId],
      toolkitSlugs: [GOOGLE_SHEETS_TOOLKIT_SLUG],
    });
  }

  return userAccounts;
}
