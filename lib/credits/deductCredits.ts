import { selectCreditsUsage } from "@/lib/supabase/credits_usage/selectCreditsUsage";
import { updateCreditsUsage } from "@/lib/supabase/credits_usage/updateCreditsUsage";

interface DeductCreditsParams {
  accountId: string;
  creditsToDeduct: number;
}

interface DeductCreditsResult {
  success: boolean;
  newBalance?: number;
  message?: string;
}

/**
 * Deducts credits from an account's credit balance.
 * @param accountId - The account ID to deduct credits from
 * @param creditsToDeduct - The number of credits to deduct
 * @returns Result object indicating success/failure and new balance
 */
export const deductCredits = async ({
  accountId,
  creditsToDeduct,
}: DeductCreditsParams): Promise<DeductCreditsResult> => {
  try {
    // Get current credit balance
    const found = await selectCreditsUsage({ account_id: accountId });

    if (!found || found.length === 0) {
      return {
        success: false,
        message: "No credits usage found for this account",
      };
    }

    const currentCredits = found[0];
    const newBalance = currentCredits.remaining_credits - creditsToDeduct;

    // Update the credit balance
    await updateCreditsUsage({
      account_id: accountId,
      updates: {
        remaining_credits: newBalance,
      },
    });

    return {
      success: true,
      newBalance,
    };
  } catch (error) {
    console.error("Failed to deduct credits:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
