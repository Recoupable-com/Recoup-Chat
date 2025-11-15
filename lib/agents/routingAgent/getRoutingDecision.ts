import { UIMessageStreamWriter } from "ai";
import { ChatRequest } from "@/lib/chat/types";
import { routingAgent, type RoutingDecision } from "./routingAgent";
import { writeRoutingStatus } from "./writeRoutingStatus";

/**
 * Routing agent that determines which specialized agent should handle the request.
 * Always uses the routingAgent for decision making.
 * Updates UI with routing status during the process if writer is provided.
 */
export async function getRoutingDecision(
  body: ChatRequest,
  writer?: UIMessageStreamWriter
): Promise<RoutingDecision> {
  const { messages } = body;

  // Send routing status to UI immediately (persistent - will appear in message history)
  writeRoutingStatus(writer, "analyzing", "Determining optimal agent...");

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

    const routingDecision = (result.output as RoutingDecision) || {
      agent: "generalAgent",
      reason: "agent-default",
    };

    // Update UI with routing result (persistent - will appear in message history)
    writeRoutingStatus(
      writer,
      "complete",
      routingDecision.agent
        ? `Routing to ${routingDecision.agent}`
        : "Using default agent",
      routingDecision.agent,
      routingDecision.reason
    );

    return routingDecision;
  } catch (error) {
    console.error("Routing agent error:", error);
    // Fallback to default
    const fallbackDecision: RoutingDecision = {
      agent: "generalAgent",
      reason: "routing-error-fallback",
    };

    // Update UI with fallback routing result
    writeRoutingStatus(
      writer,
      "complete",
      "Using default agent",
      fallbackDecision.agent,
      fallbackDecision.reason
    );

    return fallbackDecision;
  }
}
