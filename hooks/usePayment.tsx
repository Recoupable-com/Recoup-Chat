import { DEFAULT_CREDITS, PRO_CREDITS } from "@/lib/consts";
import useCredits from "./useCredits";
import useProStatus from "./useProStatus";
import { useUserProvider } from "@/providers/UserProvder";

const usePayment = () => {
  const { email, userData } = useUserProvider();
  const {
    data: creditsData,
    isLoading: isLoadingCredits,
    refetch: refetchCredits,
  } = useCredits();
  const { data: proStatusData, isLoading: isLoadingProStatus } = useProStatus();

  const isLoadingUser = email === undefined || (!!email && !userData);
  const credits = creditsData?.remaining_credits || 0;

  // Check pro status (account subscription or org subscription)
  const subscriptionActive = proStatusData?.isPro || false;
  const totalCredits = subscriptionActive ? PRO_CREDITS : DEFAULT_CREDITS;

  return {
    isLoading: isLoadingCredits || isLoadingProStatus || isLoadingUser,
    credits,
    totalCredits,
    subscriptionActive,
    refetchCredits,
    proSource: proStatusData?.proSource,
  };
};

export default usePayment;
