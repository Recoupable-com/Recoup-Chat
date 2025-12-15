import { ToolSet } from "ai";
import { CreateConnectedAccountOptions } from "@composio/core";
import { getComposioClient } from "@/lib/composio/client";
import { ChatRequestBody } from "@/lib/chat/validateChatRequest";
import getLatestUserMessageText from "@/lib/messages/getLatestUserMessageText";
import getConnectedAccount, {
  GOOGLE_SHEETS_TOOLKIT_SLUG,
} from "@/lib/composio/googleSheets/getConnectedAccount";
import googleSheetsLoginTool from "@/lib/tools/composio/googleSheetsLoginTool";

export default async function getGoogleSheetsTools(
  body: ChatRequestBody
): Promise<ToolSet> {
  const { accountId, messages } = body;

  const latestUserMessageText = getLatestUserMessageText(messages);

  const options: CreateConnectedAccountOptions = {
    callbackUrl: `https://chat.recoupable.com?q=${encodeURIComponent(
      latestUserMessageText
    )}`,
  };

  const composio = await getComposioClient();
  const userAccounts = await getConnectedAccount(accountId, options);
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
