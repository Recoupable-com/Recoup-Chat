import { usePaymentProvider } from "@/providers/PaymentProvider";
import RecoupablePro from "./RecoupablePro";
import UnlockProCard from "./UnlockProCard";

const UnlockPro = () => {
  const { isSubscribed, isLoading } = usePaymentProvider();

  if (isLoading) return null;

  return (
    <div className="mt-4 md:mx-auto px-2">
      {isSubscribed ? <RecoupablePro /> : <UnlockProCard />}
    </div>
  );
};

export default UnlockPro;
