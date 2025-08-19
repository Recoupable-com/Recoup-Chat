import { useCallback, useEffect, useState } from "react";
import { createSession } from "@/lib/stripe/createSession";
import { useUserProvider } from "@/providers/UserProvder";
import { v4 as uuidV4 } from "uuid";
import getCredits from "@/lib/supabase/getCredits";
import { getActiveSubscription } from "@/lib/stripe/getActiveSubscription";
import decreaseCredits from "@/lib/supabase/decreaseCredits";
import { DEFAULT_CREDITS } from "@/lib/consts";

const usePayment = () => {
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const { userData } = useUserProvider();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successCallbackParams, setSuccessCallbackParams] = useState("");
  const [credits, setCredits] = useState(0);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [wrappedActive, setWrappedActive] = useState(false);

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
    if (credits < minimumCredits || subscriptionActive) return;
    await decreaseCredits(userData?.account_id, minimumCredits);
    setCredits(credits - minimumCredits);
  };

  const checkCredits = useCallback(async () => {
    if (!userData) return;
    const subscriptions = await getActiveSubscription(userData?.account_id);
    if (subscriptions?.length) {
      setSubscriptionActive(true);
      setIsLoadingCredits(false);
      return;
    }
    const credits = await getCredits(userData?.account_id);
    setCredits(credits?.remaining_credits);
    setIsLoadingCredits(false);
  }, [userData]);

  useEffect(() => {
    checkCredits();
  }, [checkCredits]);

  const totalCredits = DEFAULT_CREDITS;

  return {
    setSuccessCallbackParams,
    isLoadingCredits,
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
