import { selectCreditsUsage } from "../supabase/credits_usage/selectCreditsUsage";
import { updateCreditsUsage } from "../supabase/credits_usage/updateCreditsUsage";
import { CreditsUsage } from "@/lib/supabase/credits_usage/selectCreditsUsage";
import { DEFAULT_CREDITS, PRO_CREDITS } from "../consts";
import isActiveSubscription from "../stripe/isActiveSubscription";
import { getActiveSubscriptionDetails } from "../stripe/getActiveSubscriptionDetails";

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

      const subscription = await getActiveSubscriptionDetails(accountId);
      const subscriptionActive = isActiveSubscription(subscription);
      const subscriptionStartUnix =
        subscription?.current_period_start ?? subscription?.start_date;

      const saveCredits = async (remaining: number) =>
        updateCreditsUsage({
          account_id: accountId,
          updates: {
            remaining_credits: remaining,
            timestamp: new Date().toISOString(),
          },
        });

      if (timestampDate < oneMonthAgo) {
        return saveCredits(subscriptionActive ? PRO_CREDITS : DEFAULT_CREDITS);
      }

      // If a subscription started after the last credits update, upgrade to PRO credits now
      if (subscriptionActive && subscriptionStartUnix) {
        const subscriptionStart = new Date(subscriptionStartUnix * 1000);
        if (timestampDate < subscriptionStart) {
          return saveCredits(PRO_CREDITS);
        }
      }
    }

    return creditsUsage;
  }
  return null;
};
