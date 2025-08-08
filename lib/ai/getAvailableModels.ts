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
    const filtered = apiResponse.models.filter((m) => {
      const pricing = m.pricing;
      if (!pricing) return false;
      const input = parseFloat(pricing.input);
      const output = parseFloat(pricing.output);
      if (Number.isNaN(input) || Number.isNaN(output)) return false;
      const inputPerMillion = input * 1_000_000;
      const outputPerMillion = output * 1_000_000;
      return inputPerMillion <= 0.5 && outputPerMillion <= 2.5;
    });

    // Ensure preferred default appears first if available.
    const preferredId = "google/gemini-2.5-flash";
    const preferredIndex = filtered.findIndex((m) => m.id === preferredId);
    if (preferredIndex > 0) {
      const [preferred] = filtered.splice(preferredIndex, 1);
      filtered.unshift(preferred);
    }

    return filtered;
  } catch (err) {
    console.error(
      "Failed to fetch models from Vercel AI Gateway, using fallback list.",
      err
    );
    return [];
  }
};
