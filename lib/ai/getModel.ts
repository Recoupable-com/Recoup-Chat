import { getAvailableModels } from "./getAvailableModels";
import { GatewayLanguageModelEntry } from "@ai-sdk/gateway";

/**
 * Returns a specific model by its ID from the list of available models.
 * @param modelId - The ID of the model to find
 * @returns The matching model or undefined if not found
 */
export const getModel = async (
  modelId: string
): Promise<GatewayLanguageModelEntry | undefined> => {
  try {
    const availableModels = await getAvailableModels();
    return availableModels.find((model) => model.id === modelId);
  } catch (error) {
    console.error(`Failed to get model with ID ${modelId}:`, error);
    return undefined;
  }
};
