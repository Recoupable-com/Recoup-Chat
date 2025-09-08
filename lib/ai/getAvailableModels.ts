import { gateway, GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import isEmbedModel from "./isEmbedModel";
import { getFalModels } from "./getFalModels";

/**
 * Returns the list of available LLMs from both Vercel AI Gateway and Fal AI.
 * Combines models from both providers and filters out embed models.
 */
export const getAvailableModels = async (): Promise<
  GatewayLanguageModelEntry[]
> => {
  try {
    console.log("🔄 MODELS: Fetching models from all providers");

    // Fetch models from Vercel AI Gateway
    let gatewayModels: GatewayLanguageModelEntry[] = [];
    try {
      const apiResponse = await gateway.getAvailableModels();
      gatewayModels = apiResponse.models.filter((m) => !isEmbedModel(m));
      console.log("🔄 GATEWAY MODELS: Fetched", gatewayModels.length, "models");
    } catch (gatewayErr) {
      console.error("Failed to fetch models from Vercel AI Gateway:", gatewayErr);
    }

    // Fetch models from Fal AI
    let falModels: GatewayLanguageModelEntry[] = [];
    try {
      falModels = await getFalModels();
      console.log("🔄 FAL MODELS: Fetched", falModels.length, "models");
    } catch (falErr) {
      console.error("Failed to fetch models from Fal AI:", falErr);
    }

    // Combine all models
    const allModels = [...gatewayModels, ...falModels];
    console.log("🔄 TOTAL MODELS: Combined", allModels.length, "models");

    return allModels;
  } catch (err) {
    console.error(
      "Failed to fetch models from all providers, using fallback list.",
      err
    );
    return [];
  }
};
