import { usePaymentProvider } from "@/providers/PaymentProvider";
import RecoupablePro from "./RecoupablePro";
import UnlockProCard from "./UnlockProCard";

const UnlockPro = () => {
  const { subscriptionActive } = usePaymentProvider();

  return (
    <div className="-mt-px">
      {subscriptionActive ? <RecoupablePro /> : <UnlockProCard />}
    </div>
  );
};

export default UnlockPro;
