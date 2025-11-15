import { ChatRequest } from "./types";
import { routingAgent, type RoutingDecision } from "@/lib/agents/routingAgent";

/**
 * Routing agent that determines which specialized agent should handle the request.
 * Always uses the routingAgent for decision making.
 */
export async function getRoutingDecision(
  body: ChatRequest
): Promise<RoutingDecision> {
  const { messages } = body;

  // Extract last user message for routing
  const lastMessage = messages[messages.length - 1];
  const messageText = (
    lastMessage?.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ") || ""
  ).toLowerCase();

  try {
    const result = await routingAgent.generate({
      prompt: `Message: "${messageText.substring(0, 200)}"

Quickly determine which agent should handle this. Return routing decision.`,
    });

    return (
      (result.output as RoutingDecision) || {
        agent: "generalAgent",
        reason: "agent-default",
      }
    );
  } catch (error) {
    console.error("Routing agent error:", error);
    // Fallback to default
    return {
      agent: "generalAgent",
      reason: "routing-error-fallback",
    };
  }
}
