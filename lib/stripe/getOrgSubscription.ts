import { getActiveSubscriptionDetails } from "./getActiveSubscriptionDetails";
import getUserOrganizations from "@/lib/supabase/accountOrganizationIds/getUserOrganizations";
import Stripe from "stripe";

/**
 * Check if any of the user's organizations have an active Stripe subscription.
 * Returns the first active subscription found, or null if none.
 *
 * @param accountId - The user's account ID
 * @returns The org's Stripe subscription if found, null otherwise
 */
export async function getOrgSubscription(
  accountId: string
): Promise<Stripe.Subscription | null> {
  if (!accountId) return null;

  const userOrgs = await getUserOrganizations(accountId);
  if (userOrgs.length === 0) return null;

  // Check each org for an active subscription
  for (const org of userOrgs) {
    const subscription = await getActiveSubscriptionDetails(org.organization_id);
    if (subscription) {
      return subscription;
    }
  }

  return null;
}

export default getOrgSubscription;

