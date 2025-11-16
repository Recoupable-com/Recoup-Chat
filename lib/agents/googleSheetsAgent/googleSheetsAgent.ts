import { stepCountIs, ToolLoopAgent } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { getComposioClient } from "@/lib/composio/client";

/**
 * Google Sheets agent configured for quick, single-step decisions about sheets operations.
 * It outputs a structured task that downstream tools can execute.
 */
export const getGoogleSheetsAgent = async (userId: string) => {
  // Get tools for Google Sheets
  const composio = await getComposioClient();
  const tools = await composio.tools.get(userId, {
    toolkits: ["GOOGLESHEETS"],
  });

  const agent = new ToolLoopAgent({
    model: DEFAULT_MODEL,
    instructions: "You are a Google Sheets agent.",
    tools,
    stopWhen: stepCountIs(111),
  });
  return agent;
};
