import { selectCreditsUsage } from "../supabase/credits_usage/selectCreditsUsage";
import { updateCreditsUsage } from "../supabase/credits_usage/updateCreditsUsage";
import { CreditsUsage } from "@/lib/supabase/credits_usage/selectCreditsUsage";
import { DEFAULT_CREDITS, PRO_CREDITS } from "../consts";
import isActiveSubscription from "../stripe/isActiveSubscription";
import { getActiveSubscriptionDetails } from "../stripe/getActiveSubscriptionDetails";
import { getOrgSubscription } from "../stripe/getOrgSubscription";

// Track which check determined pro status (for debugging)
export interface ProSource {
  userSubscription: boolean;
  orgSubscription: boolean;
}

export const checkAndResetCredits = async (
  accountId: string
): Promise<CreditsUsage | null> => {
  const found = await selectCreditsUsage({ account_id: accountId });
  if (!found || found.length === 0) return null;

  const creditsUsage = found[0];
  if (!creditsUsage.timestamp) return creditsUsage;

  const lastUpdatedCredits = new Date(creditsUsage.timestamp);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Check all pro sources (user subscription or org subscription)
  const userSubscription = await getActiveSubscriptionDetails(accountId);
  const orgSubscription = await getOrgSubscription(accountId);

  // Track which check passed (for debugging)
  const proSource: ProSource = {
    userSubscription: isActiveSubscription(userSubscription),
    orgSubscription: isActiveSubscription(orgSubscription),
  };

  // Log pro source for debugging
  console.log(`[Pro Check] accountId: ${accountId}`, proSource);

  const isPro = proSource.userSubscription || proSource.orgSubscription;

  // Use the actual active subscription for period tracking (prefer user over org)
  const activeSubscription = proSource.userSubscription
    ? userSubscription
    : proSource.orgSubscription
      ? orgSubscription
      : null;
  const subscriptionStartUnix =
    activeSubscription?.current_period_start ?? activeSubscription?.start_date;
  const isMonthlyRefill = lastUpdatedCredits < oneMonthAgo;
  const hasActiveSubscription = isPro && subscriptionStartUnix;
  const subscriptionStart = hasActiveSubscription
    ? new Date(subscriptionStartUnix * 1000)
    : null;
  const isSubscriptionStartedAfterLastUpdate =
    subscriptionStart && lastUpdatedCredits < subscriptionStart;
  const isRefill = isMonthlyRefill || isSubscriptionStartedAfterLastUpdate;
  if (!isRefill) return creditsUsage;

  return updateCreditsUsage({
    account_id: accountId,
    updates: {
      remaining_credits: isPro ? PRO_CREDITS : DEFAULT_CREDITS,
      timestamp: new Date().toISOString(),
    },
  });
};
