import { ToolSet } from "ai";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import { filterExcludedTools } from "./filterExcludedTools";
import { experimental_createMCPClient as createMCPClient } from "@ai-sdk/mcp";
import { withPayment } from "x402-mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { getOrCreatePurchaserAccount } from "@/lib/coinbase/getOrCreatePurchaserAccount";
import { NEW_API_BASE_URL } from "@/lib/consts";
import { getToolkitTools } from "@/lib/agents/composioAgent";
import { ChatRequestBody } from "./validateChatRequest";

/**
 * Sets up and filters tools for a chat request
 * @param body - The chat request body
 * @returns Filtered tool set ready for use
 */
export async function setupToolsForRequest(
  body: ChatRequestBody
): Promise<ToolSet> {
  const { excludeTools } = body;
  const localTools = getMcpTools();

  const account = await getOrCreatePurchaserAccount();

  const mcpClient = await createMCPClient({
    transport: new StreamableHTTPClientTransport(
      new URL("/mcp", NEW_API_BASE_URL)
    ),
  }).then((client) => withPayment(client, { account, network: "base" }));

  const mcpClientTools = await mcpClient.tools();

  // Get tools for all Composio toolkits
  const [googleSheetsTools, googleDriveTools] = await Promise.all([
    getToolkitTools("GOOGLE_SHEETS", body),
    getToolkitTools("GOOGLE_DRIVE", body),
  ]);

  const allTools: ToolSet = {
    ...mcpClientTools,
    ...googleSheetsTools,
    ...googleDriveTools,
    ...localTools,
  };

  return filterExcludedTools(allTools, excludeTools);
}
