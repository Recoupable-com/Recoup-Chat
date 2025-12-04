import { getActiveSubscriptionDetails } from "./getActiveSubscriptionDetails";
import getAccountOrganizations from "@/lib/supabase/account_organization_ids/getAccountOrganizations";
import Stripe from "stripe";

/**
 * Check if any of the account's organizations have an active Stripe subscription.
 * Returns the first active subscription found, or null if none.
 *
 * @param accountId - The account ID
 * @returns The org's Stripe subscription if found, null otherwise
 */
export async function getOrgSubscription(
  accountId: string
): Promise<Stripe.Subscription | null> {
  if (!accountId) return null;

  const accountOrgs = await getAccountOrganizations(accountId);
  if (accountOrgs.length === 0) return null;

  // Check each org for an active subscription
  for (const org of accountOrgs) {
    const subscription = await getActiveSubscriptionDetails(org.organization_id);
    if (subscription) {
      return subscription;
    }
  }

  return null;
}

export default getOrgSubscription;

