import { ChatRequest, RoutingDecision } from "@/lib/chat/types";
import { routingAgent } from "./routingAgent";
import { getGoogleSheetsAgent } from "@/lib/agents/googleSheetsAgent";
import { getGeneralAgent } from "@/lib/agents/generalAgent";
import { convertToModelMessages } from "ai";

/**
 * Routing agent that determines which specialized agent should handle the request.
 * Always uses the routingAgent for decision making.
 * Updates UI with routing status during the process if writer is provided.
 */
export async function getRoutingDecision(
  body: ChatRequest
): Promise<RoutingDecision> {
  const { messages } = body;

  const generalAgentDecision = await getGeneralAgent(body);

  try {
    const result = await routingAgent.generate({
      messages: convertToModelMessages(messages),
    });

    const routingDecision = result.output || {
      agent: "generalAgent",
      reason: "agent-default",
    };

    if (routingDecision.agent === "googleSheetsAgent") {
      const googleSheetsDecision = await getGoogleSheetsAgent(body);
      return googleSheetsDecision;
    }

    return generalAgentDecision;
  } catch (error) {
    console.error("Routing agent error:", error);
    return generalAgentDecision;
  }
}
