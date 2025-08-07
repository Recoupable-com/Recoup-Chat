import { gateway, GatewayLanguageModelEntry } from "@ai-sdk/gateway";

/**
 * Returns the list of available LLMs.
 * Internally uses `gateway.getAvailableModels()` and memoises the result.
 */
export const getAvailableModels = async (): Promise<
  GatewayLanguageModelEntry[]
> => {
  try {
    const apiResponse = await gateway.getAvailableModels();
    return apiResponse.models;
  } catch (err) {
    console.error(
      "Failed to fetch models from Vercel AI Gateway, using fallback list.",
      err
    );
    return [];
  }
};
