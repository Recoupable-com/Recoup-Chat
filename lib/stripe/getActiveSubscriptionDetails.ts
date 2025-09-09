import stripeClient from "./client";
import Stripe from "stripe";

export const getActiveSubscriptionDetails = async (accountId: string) => {
  try {
    const subscriptions = await stripeClient.subscriptions.list({
      limit: 100,
      current_period_end: {
        gt: parseInt(Number(Date.now() / 1000).toFixed(0), 10),
      },
    });

    const activeSubscriptions = subscriptions?.data?.filter(
      (subscription: Stripe.Subscription) =>
        subscription.metadata?.accountId === accountId
    );

    return activeSubscriptions.length > 0 ? activeSubscriptions[0] : null;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
};
