import { ChatRequest } from "./types";

/**
 * Handles Fal nano banana model selection and forced tool calling
 * @param body - The chat request body
 * @returns Object with resolved model and optional forced tool choice
 */
export function handleNanoBananaModel(body: ChatRequest) {
  const { model, messages } = body;
  
  // Only handle if nano banana model is selected
  if (model !== "fal-ai/nano-banana/edit") {
    return {
      resolvedModel: model,
      forcedToolChoice: undefined,
      excludeTools: undefined
    };
  }

  console.log("🍌 NANO BANANA: Setting up with nano banana tools only");
  
  return {
    resolvedModel: "google/gemini-2.5-flash-lite",
    forcedToolChoice: undefined, // Let LM decide, but only nano banana tools available
    excludeTools: ["generate_image"] // Exclude the regular image generation tool
  };
}
