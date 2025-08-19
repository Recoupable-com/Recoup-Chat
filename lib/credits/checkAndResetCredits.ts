import { selectCreditsUsage } from "../supabase/credits_usage/selectCreditsUsage";
import { updateCreditsUsage } from "../supabase/credits_usage/updateCreditsUsage";
import { CreditsUsage } from "@/lib/supabase/credits_usage/selectCreditsUsage";
import { DEFAULT_CREDITS } from "../consts";

export const checkAndResetCredits = async (
  accountId: string
): Promise<CreditsUsage | null> => {
  const found = await selectCreditsUsage({ account_id: accountId });

  if (found && found.length > 0) {
    const creditsUsage = found[0];

    if (creditsUsage.timestamp) {
      const timestampDate = new Date(creditsUsage.timestamp);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      if (timestampDate < oneMonthAgo) {
        const updatedCreditsUsage = await updateCreditsUsage({
          account_id: accountId,
          updates: {
            remaining_credits: DEFAULT_CREDITS,
            timestamp: new Date().toISOString(),
          },
        });

        return updatedCreditsUsage;
      }
    }

    return creditsUsage;
  }
  return null;
};
