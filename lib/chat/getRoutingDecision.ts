import { UIMessageStreamWriter } from "ai";
import { ChatRequest } from "./types";
import { routingAgent, type RoutingDecision } from "@/lib/agents/routingAgent";
import { ROUTING_STATUS_DATA_TYPE } from "@/lib/consts";

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
  if (writer) {
    writer.write({
      type: ROUTING_STATUS_DATA_TYPE,
      id: "routing-status", // Use ID for reconciliation
      data: {
        status: "analyzing",
        message: "Determining optimal agent...",
      },
    });
  }

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
    if (writer) {
      writer.write({
        type: ROUTING_STATUS_DATA_TYPE,
        id: "routing-status", // Use ID for reconciliation
        data: {
          status: "complete",
          message: routingDecision.agent
            ? `Routing to ${routingDecision.agent}`
            : "Using default agent",
          agent: routingDecision.agent,
          reason: routingDecision.reason,
        },
      });
    }

    return routingDecision;
  } catch (error) {
    console.error("Routing agent error:", error);
    // Fallback to default
    const fallbackDecision: RoutingDecision = {
      agent: "generalAgent",
      reason: "routing-error-fallback",
    };

    // Update UI with fallback routing result
    if (writer) {
      writer.write({
        type: ROUTING_STATUS_DATA_TYPE,
        id: "routing-status", // Use ID for reconciliation
        data: {
          status: "complete",
          message: "Using default agent",
          agent: fallbackDecision.agent,
          reason: fallbackDecision.reason,
        },
      });
    }

    return fallbackDecision;
  }
}
