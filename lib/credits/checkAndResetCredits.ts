import { selectCreditsUsage } from "../supabase/credits_usage/selectCreditsUsage";
import { updateCreditsUsage } from "../supabase/credits_usage/updateCreditsUsage";
import { CreditsUsage } from "@/lib/supabase/credits_usage/selectCreditsUsage";
import { DEFAULT_CREDITS, PRO_CREDITS } from "../consts";
import isActiveSubscription from "../stripe/isActiveSubscription";
import { getActiveSubscriptionDetails } from "../stripe/getActiveSubscriptionDetails";
import isEnterpriseAccount from "@/lib/recoup/isEnterpriseAccount";

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
  const subscription = await getActiveSubscriptionDetails(accountId);
  const subscriptionActive = isActiveSubscription(subscription);
  const subscriptionStartUnix =
    subscription?.current_period_start ?? subscription?.start_date;
  const isMonthlyRefill = lastUpdatedCredits < oneMonthAgo;
  const enterprise = await isEnterpriseAccount(accountId);
  const hasActiveSubscription = subscriptionActive && subscriptionStartUnix;
  const subscriptionStart = hasActiveSubscription
    ? new Date(subscriptionStartUnix * 1000)
    : null;
  const isSubscriptionStartedAfterLastUpdate =
    subscriptionStart && lastUpdatedCredits < subscriptionStart;
  const isRefill = isMonthlyRefill || isSubscriptionStartedAfterLastUpdate;
  if (!isRefill) return creditsUsage;
  const isPro = subscriptionActive || enterprise;

  return updateCreditsUsage({
    account_id: accountId,
    updates: {
      remaining_credits: isPro ? PRO_CREDITS : DEFAULT_CREDITS,
      timestamp: new Date().toISOString(),
    },
  });
};
