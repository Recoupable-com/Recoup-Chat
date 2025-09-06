import { GatewayLanguageModelEntry } from "@ai-sdk/gateway";

/**
 * Returns the list of available Fal AI models.
 * For now, returns a curated list of popular Fal models.
 */
export const getFalModels = async (): Promise<GatewayLanguageModelEntry[]> => {
  console.log("🎨 FAL MODELS: Returning curated Fal models list");
  
  // Curated list of popular and useful Fal models
  const falModels: GatewayLanguageModelEntry[] = [
    {
      id: "fal-ai/nano-banana/edit",
      name: "Nano Banana",
      description: "Google's state-of-the-art image generation and editing model",
      pricing: {
        input: "0.0001", // Estimated - adjust based on actual Fal pricing
        output: "0.001"
      }
    },
    {
      id: "fal-ai/flux/dev",
      name: "FLUX.1 Dev",
      description: "FLUX.1 [dev] model for high-quality image generation",
      pricing: {
        input: "0.0001",
        output: "0.001"
      }
    },
    {
      id: "fal-ai/flux-pro/kontext",
      name: "FLUX Pro Kontext", 
      description: "FLUX.1 Kontext [pro] handles both text and reference images",
      pricing: {
        input: "0.0002",
        output: "0.002"
      }
    },
    {
      id: "fal-ai/ideogram/character",
      name: "Ideogram Character",
      description: "Generate consistent character appearances across multiple images",
      pricing: {
        input: "0.0001",
        output: "0.001"
      }
    }
  ];

  console.log("🎨 FAL MODELS: Returning", falModels.length, "models");
  return falModels;
};
