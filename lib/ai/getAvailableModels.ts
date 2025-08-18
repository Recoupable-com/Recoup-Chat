import { gateway, GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import isEmbedModel from "./isEmbedModel";

/**
 * Returns the list of available LLMs.
 * Internally uses `gateway.getAvailableModels()` and memoises the result.
 */
export const getAvailableModels = async (): Promise<
  GatewayLanguageModelEntry[]
> => {
  try {
    const apiResponse = await gateway.getAvailableModels();
    const filtered = apiResponse.models.filter((m) => !isEmbedModel(m));
    return filtered;
  } catch (err) {
    console.error(
      "Failed to fetch models from Vercel AI Gateway, using fallback list.",
      err
    );
    return [];
  }
};
