import { ChatRequest } from "@/lib/chat/types";
import { routingAgent, type RoutingDecision } from "./routingAgent";
import { getGoogleSheetsAgent } from "../googleSheetsAgent/googleSheetsAgent";
import { getGeneralAgent } from "../generalAgent";
import type { ToolLoopAgent } from "ai";

/**
 * Routing agent that determines which specialized agent should handle the request.
 * Always uses the routingAgent for decision making.
 * Updates UI with routing status during the process if writer is provided.
 */
export async function getRoutingDecision(
  body: ChatRequest
): Promise<ToolLoopAgent> {
  const { messages } = body;

  const generalAgent = await getGeneralAgent(body);

  try {
    const result = await routingAgent.generate({
      messages,
      prompt: `Quickly determine which agent should handle this request. Return routing decision.`,
    });

    const routingDecision = (result.output as RoutingDecision) || {
      agent: "generalAgent",
      reason: "agent-default",
    };

    if (routingDecision.agent === "googleSheetsAgent") {
      const googleSheetsAgent = await getGoogleSheetsAgent(body);
      return googleSheetsAgent;
    }

    return generalAgent;
  } catch (error) {
    console.error("Routing agent error:", error);
    return generalAgent;
  }
}
