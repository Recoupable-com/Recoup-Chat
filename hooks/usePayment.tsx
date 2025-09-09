import { DEFAULT_CREDITS, PRO_CREDITS } from "@/lib/consts";
import useCredits from "./useCredits";
import useSubscription from "./useSubscription";
import isActiveSubscription from "@/lib/stripe/isActiveSubscription";

const usePayment = () => {
  const {
    data: creditsData,
    isLoading: isLoadingCredits,
    refetch: refetchCredits,
  } = useCredits();
  const { data: subscriptionData, isLoading: isLoadingSubscription } =
    useSubscription();

  const credits = creditsData?.remaining_credits || 0;
  const subscription = subscriptionData?.[0];
  const subscriptionActive = isActiveSubscription(subscription);
  const totalCredits = subscriptionActive ? PRO_CREDITS : DEFAULT_CREDITS;

  return {
    isLoadingCredits: isLoadingCredits || isLoadingSubscription,
    credits,
    totalCredits,
    subscriptionActive,
    refetchCredits,
    subscription,
  };
};

export default usePayment;
