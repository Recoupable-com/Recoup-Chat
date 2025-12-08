import { ToolSet } from "ai";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import { filterExcludedTools } from "./filterExcludedTools";
import { experimental_createMCPClient as createMCPClient } from "@ai-sdk/mcp";
import { withPayment } from "x402-mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { getOrCreatePurchaserAccount } from "@/lib/coinbase/getOrCreatePurchaserAccount";
import { NEW_API_BASE_URL } from "@/lib/consts";
import { getGoogleSheetsTools } from "@/lib/agents/googleSheetsAgent";
import { ChatRequest } from "@/lib/chat/types";

/**
 * Sets up and filters tools for a chat request
 * @param excludeTools - Optional array of tool names to exclude
 * @returns Filtered tool set ready for use
 */
export async function setupToolsForRequest(
  body: ChatRequest
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
  const googleSheetsTools = await getGoogleSheetsTools(body);
  const allTools: ToolSet = {
    ...mcpClientTools,
    ...googleSheetsTools,
    ...localTools,
  };

  const tools = filterExcludedTools(allTools, excludeTools);
  return tools;
}
