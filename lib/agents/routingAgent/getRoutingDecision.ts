import { ChatRequest } from "@/lib/chat/types";
import { routingAgent, type RoutingDecision } from "./routingAgent";
import { getLastMessageText } from "@/lib/messages/getLastMessage";

/**
 * Routing agent that determines which specialized agent should handle the request.
 * Always uses the routingAgent for decision making.
 * Updates UI with routing status during the process if writer is provided.
 */
export async function getRoutingDecision(
  body: ChatRequest
): Promise<RoutingDecision> {
  const { messages } = body;

  const messageText = getLastMessageText(messages);

  try {
    const result = await routingAgent.generate({
      prompt: `Message: "${messageText.substring(0, 200)}"

Quickly determine which agent should handle this. Return routing decision.`,
    });

    const routingDecision = (result.output as RoutingDecision) || {
      agent: "generalAgent",
      reason: "agent-default",
    };

    return routingDecision;
  } catch (error) {
    console.error("Routing agent error:", error);
    // Fallback to default
    const fallbackDecision: RoutingDecision = {
      agent: "generalAgent",
      reason: "routing-error-fallback",
    };

    return fallbackDecision;
  }
}
