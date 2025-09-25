import { usePaymentProvider } from "@/providers/PaymentProvider";
import RecoupablePro from "./RecoupablePro";
import UnlockProCard from "./UnlockProCard";

const UnlockPro = () => {
  const { subscriptionActive, isLoading } = usePaymentProvider();

  if (isLoading) return null;

  return (
    <div className="-mt-px md:mx-auto">
      {subscriptionActive ? <RecoupablePro /> : <UnlockProCard />}
    </div>
  );
};

export default UnlockPro;
