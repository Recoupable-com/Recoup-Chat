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
      resolvedModel: model,
      shouldPassImageUrlsThrough: false,
    };
  }

  // Configure nano banana model with appropriate tool filtering
  // Using GPT-5 which has excellent vision + tool calling capabilities

  return {
    resolvedModel: "openai/gpt-5",
    shouldPassImageUrlsThrough: true, // Enable URL passthrough for image editing
  };
}
