import { DEFAULT_CREDITS } from "@/lib/consts";
import useCredits from "./useCredits";
import useSubscription from "./useSubscription";

const usePayment = () => {
  const {
    data: creditsData,
    isLoading: isLoadingCredits,
    refetch: refetchCredits,
  } = useCredits();
  const { data: subscriptionData, isLoading: isLoadingSubscription } =
    useSubscription();

  const totalCredits = DEFAULT_CREDITS;
  const credits = creditsData?.remaining_credits || 0;
  const subscriptionActive = (subscriptionData?.length || 0) > 0;

  return {
    isLoadingCredits: isLoadingCredits || isLoadingSubscription,
    credits,
    totalCredits,
    subscriptionActive,
    refetchCredits,
  };
};

export default usePayment;
