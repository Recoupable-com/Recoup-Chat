import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createSession } from "@/lib/stripe/createSession";
import { useUserProvider } from "@/providers/UserProvder";
import { v4 as uuidV4 } from "uuid";
import getCredits from "@/lib/supabase/getCredits";
import { getActiveSubscription } from "@/lib/stripe/getActiveSubscription";
import decreaseCredits from "@/lib/supabase/decreaseCredits";
import { DEFAULT_CREDITS } from "@/lib/consts";

const usePayment = () => {
  const { userData } = useUserProvider();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successCallbackParams, setSuccessCallbackParams] = useState("");
  const [wrappedActive, setWrappedActive] = useState(false);

  // React Query for credits
  const {
    data: creditsData,
    isLoading: isLoadingCredits,
    refetch: refetchCredits,
  } = useQuery({
    queryKey: ["credits", userData?.account_id],
    queryFn: () => getCredits(userData?.account_id),
    enabled: !!userData?.account_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // React Query for subscription status
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery(
    {
      queryKey: ["subscription", userData?.account_id],
      queryFn: () => getActiveSubscription(userData?.account_id),
      enabled: !!userData?.account_id,
      staleTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
    }
  );

  const toggleModal = (wrapped: boolean = false) => {
    setWrappedActive(!isModalOpen && wrapped);
    setIsModalOpen(!isModalOpen);
  };

  const createCheckoutSession = async (
    productName: string,
    isSubscription: boolean
  ) => {
    const referenceId = uuidV4();
    const sessionResponse = await createSession(
      `${window.location.href}?referenceId=${referenceId}&${successCallbackParams || ""}`,
      productName,
      referenceId,
      isSubscription,
      wrappedActive ? 495 : 99,
      {
        accountId: userData?.account_id,
      }
    );

    window.open(sessionResponse.url, "_self");
  };

  const creditUsed = async (minimumCredits: number) => {
    const currentCredits = creditsData?.remaining_credits || 0;
    const subscriptionActive = subscriptionData?.length > 0;

    if (currentCredits < minimumCredits || subscriptionActive) return;

    await decreaseCredits(userData?.account_id, minimumCredits);
    // Refetch credits after usage to get updated balance
    refetchCredits();
  };

  const totalCredits = DEFAULT_CREDITS;
  const credits = creditsData?.remaining_credits || 0;
  const subscriptionActive = subscriptionData?.length > 0;

  return {
    setSuccessCallbackParams,
    isLoadingCredits: isLoadingCredits || isLoadingSubscription,
    createCheckoutSession,
    isModalOpen,
    setIsModalOpen,
    toggleModal,
    credits,
    totalCredits,
    creditUsed,
    subscriptionActive,
    wrappedActive,
  };
};

export default usePayment;
