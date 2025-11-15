import { generateObject } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { z } from "zod";
import { LIGHTWEIGHT_MODEL, DEFAULT_MODEL } from "@/lib/consts";
import { ChatRequest } from "./types";

const RoutingDecisionSchema = z.object({
  model: z.string().optional(),
  excludeTools: z.array(z.string()).optional(),
  reason: z.string().optional(),
});

type RoutingDecision = z.infer<typeof RoutingDecisionSchema>;

/**
 * Fast routing agent that determines optimal model and tool configuration.
 * Uses pattern matching for common cases, falls back to ToolLoopAgent for complex routing.
 * Designed to be fast and non-blocking.
 */
export async function getRoutingDecision(
  body: ChatRequest
): Promise<RoutingDecision> {
  const { messages, model: requestedModel } = body;

  // If user explicitly selected a model, respect it (no routing needed)
  if (requestedModel) {
    return {
      model: requestedModel,
      excludeTools: undefined,
      reason: "user-selected",
    };
  }

  // Extract last user message for routing
  const lastMessage = messages[messages.length - 1];
  const messageText = (
    lastMessage?.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ") || ""
  ).toLowerCase();

  // Fast pattern-based routing for common cases (avoids LLM call)
  const imageEditPatterns = [
    "edit image",
    "modify image",
    "change image",
    "adjust image",
  ];
  const hasImageEdit = imageEditPatterns.some((pattern) =>
    messageText.includes(pattern)
  );

  if (hasImageEdit) {
    return {
      model: "openai/gpt-5", // Vision-capable model
      excludeTools: ["generate_image"],
      reason: "image-editing-detected",
    };
  }

  // For other cases, use generateObject (agent-like, fast, single step)
  try {
    const { object } = await generateObject({
      model: gateway(LIGHTWEIGHT_MODEL),
      schema: RoutingDecisionSchema,
      prompt: `You are a fast routing agent. Determine the optimal model for this message.

Message: "${messageText.substring(0, 200)}"

Rules:
- Image editing → "openai/gpt-5"
- Complex reasoning → "openai/gpt-5"
- Simple queries → "${DEFAULT_MODEL}"
- Default → "${DEFAULT_MODEL}"

Return routing decision. Only route if needed, otherwise leave model empty.`,
      temperature: 0, // Deterministic for speed
    });

    return object as RoutingDecision;
  } catch (error) {
    console.error("Routing agent error:", error);
    // Fallback to default
    return {
      model: DEFAULT_MODEL,
      excludeTools: undefined,
      reason: "routing-error-fallback",
    };
  }
}
