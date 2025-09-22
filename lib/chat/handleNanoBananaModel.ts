import { ChatRequest } from "./types";

/**
 * Handles Fal nano banana model selection and tool filtering
 * @param body - The chat request body
 * @returns Object with resolved model and optional tool exclusions
 */
export function handleNanoBananaModel(body: ChatRequest) {
  const { model } = body;
  
  // Only handle if nano banana model is selected
  if (model !== "fal-ai/nano-banana/edit") {
    return {
      resolvedModel: "xai/grok-4-fast-non-reasoning",
      forcedToolChoice: undefined,
      excludeTools: undefined
    };
  }

  // Configure nano banana model with appropriate tool filtering
  
  return {
    resolvedModel: "google/gemini-2.5-flash-lite",
    forcedToolChoice: undefined, // Let LM decide, but only nano banana tools available
    excludeTools: ["generate_image"] // Exclude the regular image generation tool
  };
}
