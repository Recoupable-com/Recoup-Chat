import { useUserProvider } from "@/providers/UserProvder";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import createClientPortalSession from "@/lib/stripe/createClientPortalSession";
import createClientCheckoutSession from "@/lib/stripe/createClientCheckoutSession";

const useSubscribeClick = () => {
  const { userData } = useUserProvider();
  const { isSubscribed } = usePaymentProvider();

  const handleClick = () => {
    if (!userData?.account_id) return;

    if (isSubscribed) {
      createClientPortalSession(userData.account_id);
      return;
    }
    createClientCheckoutSession(userData.account_id);
  };

  return {
    handleClick,
    isSubscribed,
  };
};

export default useSubscribeClick;
