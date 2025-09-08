import { GatewayLanguageModelEntry } from "@ai-sdk/gateway";

export const isFreeModel = (m: GatewayLanguageModelEntry) => {
  // Handle Fal models specifically
  if (m.id.startsWith("fal-ai/")) {
    // Make nano banana free for testing
    if (m.id === "fal-ai/nano-banana/edit") {
      return true;
    }
    // Other Fal models are paid/pro models
    return false;
  }

  const pricing = m.pricing;
  if (!pricing) return false;
  const input = parseFloat(pricing.input);
  const output = parseFloat(pricing.output);
  if (Number.isNaN(input) || Number.isNaN(output)) return false;
  const inputPerMillion = input * 1_000_000;
  const outputPerMillion = output * 1_000_000;
  return inputPerMillion <= 0.5 && outputPerMillion <= 2.5;
};

export default isFreeModel;
