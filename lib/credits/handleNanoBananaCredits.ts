import { deductCredits } from "../credits/deductCredits";

/**
 * Handles credit deduction after nano banana image tool call.
 * Calculates usage cost and deducts appropriate credits from the user's account.
 * @param accountId - The account ID to deduct credits from
 */
export const handleNanoBananaCredits = async (
  accountId: string
): Promise<void> => {
  try {
    await deductCredits({
      accountId,
      creditsToDeduct: 4,
    });
  } catch (error) {
    console.error("Failed to deduct nano banana credits:", error);
    // Don't throw error to avoid breaking the chat flow
  }
};
