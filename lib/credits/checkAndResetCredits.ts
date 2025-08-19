import { selectCreditsUsage } from "../supabase/credits_usage/selectCreditsUsage";
import { updateCreditsUsage } from "../supabase/credits_usage/updateCreditsUsage";
import { CreditsUsage } from "@/lib/supabase/credits_usage/selectCreditsUsage";

export const checkAndResetCredits = async (
  accountId: string
): Promise<CreditsUsage | null> => {
  const found = await selectCreditsUsage({ account_id: accountId });
  console.log(found);

  if (found && found.length > 0) {
    const creditsUsage = found[0];

    // Check if timestamp is over one month in the past
    if (creditsUsage.timestamp) {
      const timestampDate = new Date(creditsUsage.timestamp);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      if (timestampDate < oneMonthAgo) {
        console.log("Timestamp is over one month old, resetting credits");

        // Reset credits to 333 and update timestamp to now
        const updatedCreditsUsage = await updateCreditsUsage({
          account_id: accountId,
          updates: {
            remaining_credits: 333,
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
