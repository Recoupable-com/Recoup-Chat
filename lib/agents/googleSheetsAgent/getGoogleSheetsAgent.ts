import { stepCountIs, ToolLoopAgent } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { ChatRequest, RoutingDecision } from "@/lib/chat/types";
import getGoogleSheetsTools from "./getGoogleSheetsTools";

export default async function getGoogleSheetsAgent(
  body: ChatRequest
): Promise<RoutingDecision> {
  const { accountId, model: bodyModel } = body;

  const tools = await getGoogleSheetsTools(body);
  const model = bodyModel || DEFAULT_MODEL;
  const stopWhen = stepCountIs(111);
  const instructions = `You are a Google Sheets agent.
  account_id: ${accountId}`;

  const agent = new ToolLoopAgent({
    model,
    instructions,
    tools,
    stopWhen,
    prepareStep: (options) => {
      return options.stepNumber === 1
        ? {
            toolChoice: "required",
          }
        : options;
    },
  });

  return {
    agent,
    model,
    instructions,
    stopWhen,
  };
}
