import { ToolSet } from "ai";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import { filterExcludedTools } from "./filterExcludedTools";
import { experimental_createMCPClient as createMCPClient } from "@ai-sdk/mcp";
import { withPayment } from "x402-mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { getOrCreatePurchaserAccount } from "@/lib/coinbase/getOrCreatePurchaserAccount";
import { NEW_API_BASE_URL } from "@/lib/consts";
import { ChatRequestBody } from "./validateChatRequest";

/**
 * Sets up and filters tools for a chat request.
 *
 * Tools are sourced from:
 * - MCP client (Recoup-API) - includes Composio Tool Router for Google Sheets, etc.
 * - Local tools (getMcpTools)
 *
 * @param body - The chat request body
 * @returns Filtered tool set ready for use
 */
export async function setupToolsForRequest(
  body: ChatRequestBody
): Promise<ToolSet> {
  const { excludeTools, accessToken } = body;
  const localTools = getMcpTools();

  const account = await getOrCreatePurchaserAccount();

  const mcpClient = await createMCPClient({
    transport: new StreamableHTTPClientTransport(
      new URL("/mcp", NEW_API_BASE_URL),
      {
        requestInit: {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      }
    ),
  }).then((client) => withPayment(client, { account, network: "base" }));

  const mcpClientTools = await mcpClient.tools();
  const allTools: ToolSet = {
    ...mcpClientTools,
    ...localTools,
  };

  const tools = filterExcludedTools(allTools, excludeTools);
  return tools;
}
