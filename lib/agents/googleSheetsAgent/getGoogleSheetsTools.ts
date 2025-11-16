import { ToolSet } from "ai";
import { getComposioClient } from "@/lib/composio/client";
import getConnectedAccount, {
  GOOGLE_SHEETS_TOOLKIT_SLUG,
} from "@/lib/composio/googleSheets/getConnectedAccount";
import googleSheetsLoginTool from "@/lib/tools/composio/googleSheetsLoginTool";

export default async function getGoogleSheetsTools(
  accountId: string
): Promise<ToolSet> {
  const composio = await getComposioClient();
  const userAccounts = await getConnectedAccount(accountId);
  const isAuthenticated = userAccounts.items[0]?.data?.status === "ACTIVE";

  const tools = isAuthenticated
    ? await composio.tools.get(accountId, {
        toolkits: [GOOGLE_SHEETS_TOOLKIT_SLUG],
      })
    : {
        googleSheetsLoginTool,
      };

  return tools;
}
