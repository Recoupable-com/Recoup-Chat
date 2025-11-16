import { stepCountIs, ToolLoopAgent } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { getComposioClient } from "@/lib/composio/client";
import { ChatRequest } from "@/lib/chat/types";

/**
 * Google Sheets agent configured for quick, single-step decisions about sheets operations.
 * It outputs a structured task that downstream tools can execute.
 */
export const getGoogleSheetsAgent = async (body: ChatRequest) => {
  const { accountId, model } = body;

  // Get tools for Google Sheets
  const composio = await getComposioClient();
  const tools = await composio.tools.get(accountId, {
    toolkits: ["GOOGLESHEETS"],
  });

  const agent = new ToolLoopAgent({
    model: model || DEFAULT_MODEL,
    instructions: "You are a Google Sheets agent.",
    tools,
    stopWhen: stepCountIs(111),
  });
  return agent;
};
