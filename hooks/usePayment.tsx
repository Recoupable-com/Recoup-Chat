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

  // Use new pro status check (includes user sub, org sub, and enterprise domain)
  const subscriptionActive = proStatusData?.isPro || false;
  const totalCredits = subscriptionActive ? PRO_CREDITS : DEFAULT_CREDITS;

  // Log pro source for debugging (client-side)
  if (proStatusData?.proSource) {
    console.log("[usePayment] Pro source:", proStatusData.proSource);
  }

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
