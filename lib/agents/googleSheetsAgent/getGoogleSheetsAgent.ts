import { stepCountIs, ToolLoopAgent } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { getComposioClient } from "@/lib/composio/client";
import { ChatRequest, RoutingDecision } from "@/lib/chat/types";

/**
 * Google Sheets agent configured for quick, single-step decisions about sheets operations.
 * It outputs a structured task that downstream tools can execute.
 */
export default async function getGoogleSheetsAgent(
  body: ChatRequest
): Promise<RoutingDecision> {
  const { accountId, model: bodyModel } = body;

  // Get tools for Google Sheets
  const composio = await getComposioClient();
  const tools = await composio?.tools.get(accountId, {
    toolkits: ["GOOGLESHEETS"],
  });

  const model = bodyModel || DEFAULT_MODEL;
  const stopWhen = stepCountIs(111);
  const instructions = "You are a Google Sheets agent.";

  const agent = new ToolLoopAgent({
    model,
    instructions,
    tools,
    stopWhen,
  });

  return {
    agent,
    model,
    instructions,
    stopWhen,
  };
}
