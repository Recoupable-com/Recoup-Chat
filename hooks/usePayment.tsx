import { useState } from "react";
import { createSession } from "@/lib/stripe/createSession";
import { useUserProvider } from "@/providers/UserProvder";
import { v4 as uuidV4 } from "uuid";
import { DEFAULT_CREDITS } from "@/lib/consts";
import useCredits from "./useCredits";
import useSubscription from "./useSubscription";

const usePayment = () => {
  const { userData } = useUserProvider();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successCallbackParams, setSuccessCallbackParams] = useState("");
  const [wrappedActive, setWrappedActive] = useState(false);
  const { data: creditsData, isLoading: isLoadingCredits } = useCredits();
  const { data: subscriptionData, isLoading: isLoadingSubscription } =
    useSubscription();

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

  const totalCredits = DEFAULT_CREDITS;
  const credits = creditsData?.remaining_credits || 0;
  const subscriptionActive = (subscriptionData?.length || 0) > 0;

  return {
    setSuccessCallbackParams,
    isLoadingCredits: isLoadingCredits || isLoadingSubscription,
    createCheckoutSession,
    isModalOpen,
    setIsModalOpen,
    toggleModal,
    credits,
    totalCredits,
    subscriptionActive,
    wrappedActive,
  };
};

export default usePayment;
