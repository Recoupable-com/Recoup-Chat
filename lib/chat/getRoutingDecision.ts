import { ChatRequest } from "./types";
import { routingAgent, type RoutingDecision } from "@/lib/agents/routingAgent";

/**
 * Fast routing agent that determines which specialized agent should handle the request.
 * Uses pattern matching for common cases, falls back to ToolLoopAgent for complex routing.
 * Designed to be fast and non-blocking.
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

  // Fast pattern-based routing for common cases (avoids LLM call)
  const googleSheetsPatterns = [
    "google sheets",
    "googlesheet",
    "spreadsheet",
    "csv",
    "excel",
    "tabular data",
    "data table",
    "sheet",
    "row",
    "column",
    "cell",
  ];
  const hasGoogleSheets = googleSheetsPatterns.some((pattern) =>
    messageText.includes(pattern)
  );

  if (hasGoogleSheets) {
    return {
      agent: "googleSheetsAgent",
      reason: "google-sheets-detected",
    };
  }

  // For other cases, use ToolLoopAgent (fast, single step)
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
