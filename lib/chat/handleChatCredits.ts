import { getCreditUsage } from "../ai/getCreditUsage";
import { deductCredits } from "../credits/deductCredits";
import { LanguageModelUsage } from "ai";

interface HandleChatCreditsParams {
  usage: LanguageModelUsage;
  model: string;
  accountId?: string;
}

/**
 * Handles credit deduction after chat completion.
 * Calculates usage cost and deducts appropriate credits from the user's account.
 * @param usage - The language model usage data
 * @param model - The model ID used for the chat
 * @param accountId - The account ID to deduct credits from (optional)
 */
export const handleChatCredits = async ({
  usage,
  model,
  accountId,
}: HandleChatCreditsParams): Promise<void> => {
  if (!accountId) {
    console.log("No account ID provided, skipping credit deduction");
    return;
  }

  try {
    const usageCost = await getCreditUsage(usage, model);

    if (usageCost > 0) {
      const creditsToDeduct = Math.max(1, Math.round(usageCost * 100));
      console.log("deducting credits:", creditsToDeduct);

      await deductCredits({
        accountId,
        creditsToDeduct,
      });
    }
  } catch (error) {
    console.error("Failed to handle chat credits:", error);
    // Don't throw error to avoid breaking the chat flow
  }
};
