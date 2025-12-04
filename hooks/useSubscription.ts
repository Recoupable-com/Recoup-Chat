import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getActiveSubscription } from "@/lib/stripe/getActiveSubscription";
import { useUserProvider } from "@/providers/UserProvder";
import Stripe from "stripe";

type SubscriptionResponse = {
  status: "success" | "error";
  subscription?: Stripe.Subscription;
};

const useSubscription = (): UseQueryResult<SubscriptionResponse> => {
  const { userData } = useUserProvider();
  return useQuery({
    queryKey: ["subscription", userData?.account_id],
    queryFn: () => getActiveSubscription(userData?.account_id),
    enabled: !!userData?.account_id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
  });
};

export default useSubscription;
