import { DEFAULT_CREDITS, PRO_CREDITS } from "@/lib/consts";
import supabase from "../serverClient";
import { getActiveSubscriptionDetails } from "@/lib/stripe/getActiveSubscriptionDetails";
import isActiveSubscription from "@/lib/stripe/isActiveSubscription";

export const initializeAccountCredits = async (accountId: string) => {
  const subscription = await getActiveSubscriptionDetails(accountId);
  const subscriptionActive = isActiveSubscription(subscription);
  await supabase.from("credits_usage").insert({
    account_id: accountId,
    remaining_credits: subscriptionActive ? PRO_CREDITS : DEFAULT_CREDITS,
  });
};
