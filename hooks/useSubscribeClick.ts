import { useUserProvider } from "@/providers/UserProvder";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import createClientPortalSession from "@/lib/stripe/createClientPortalSession";
import createClientCheckoutSession from "@/lib/stripe/createClientCheckoutSession";

const useSubscribeClick = () => {
  const { userData } = useUserProvider();
  const { subscription } = usePaymentProvider();

  const handleClick = () => {
    if (!userData?.account_id) return;

    if (subscription) {
      createClientPortalSession(userData.account_id);
      return;
    }
    createClientCheckoutSession(userData.account_id);
  };

  return {
    handleClick,
    subscription,
  };
};

export default useSubscribeClick;
