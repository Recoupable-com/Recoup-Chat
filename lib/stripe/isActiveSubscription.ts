import Stripe from "stripe";

const isActiveSubscription = (subscription?: Stripe.Subscription | null) => {
  if (!subscription) return false;
  const isTrial = subscription?.status === "trialing";
  const isCanceledTrial = isTrial && subscription?.canceled_at;
  const subscriptionActive = !isCanceledTrial;
  return subscriptionActive;
};

export default isActiveSubscription;
