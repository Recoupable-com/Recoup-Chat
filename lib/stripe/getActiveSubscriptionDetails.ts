import { getActiveSubscriptions } from "./getActiveSubscriptions";

export const getActiveSubscriptionDetails = async (accountId: string) => {
  try {
    const activeSubscriptions = await getActiveSubscriptions(accountId);
    return activeSubscriptions.length > 0 ? activeSubscriptions[0] : null;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
};
