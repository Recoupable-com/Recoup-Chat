import { GatewayLanguageModelEntry } from "@ai-sdk/gateway";

export const isEmbedModel = (m: GatewayLanguageModelEntry) => {
  const pricing = m.pricing;
  if (!pricing) return false;
  const output = parseFloat(pricing.output);
  return output === 0;
};

export default isEmbedModel;
