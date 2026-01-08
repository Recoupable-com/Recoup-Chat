import { ToolSet } from "ai";
import { CreateConnectedAccountOptions } from "@composio/core";
import { getComposioClient } from "@/lib/composio/client";
import { ChatRequestBody } from "@/lib/chat/validateChatRequest";
import getLatestUserMessageText from "@/lib/messages/getLatestUserMessageText";
import {
  getConnectedAccount,
  isConnectionActive,
} from "@/lib/composio/getConnectedAccount";
import { ComposioToolkitKey, getToolkitConfig } from "@/lib/composio/toolkits";
import { getLoginToolForToolkit } from "@/lib/tools/composio/loginTools";

/**
 * Get tools for a Composio toolkit.
 * Returns actual toolkit tools if authenticated, or a login tool if not.
 *
 * @param toolkitKey - The toolkit to get tools for
 * @param body - The chat request body containing accountId and messages
 * @returns ToolSet with either toolkit tools or login tool
 */
export async function getToolkitTools(
  toolkitKey: ComposioToolkitKey,
  body: ChatRequestBody
): Promise<ToolSet> {
  const { accountId, messages } = body;
  const config = getToolkitConfig(toolkitKey);

  const latestUserMessageText = getLatestUserMessageText(messages);

  const options: CreateConnectedAccountOptions = {
    callbackUrl: `https://chat.recoupable.com?q=${encodeURIComponent(
      latestUserMessageText
    )}`,
  };

  const composio = await getComposioClient();
  const userAccounts = await getConnectedAccount(toolkitKey, accountId, options);

  if (isConnectionActive(userAccounts)) {
    return await composio.tools.get(accountId, {
      toolkits: [config.slug],
    });
  }

  // Return the login tool for this toolkit
  const loginTool = getLoginToolForToolkit(toolkitKey);
  return { [config.loginToolName]: loginTool };
}
