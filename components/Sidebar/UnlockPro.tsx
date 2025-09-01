import { usePaymentProvider } from "@/providers/PaymentProvider";
import UnlimitedCredits from "./UnlimitedCredits";

const UnlockPro = () => {
  const { subscriptionActive } = usePaymentProvider();

  return (
    <div className="-mt-px">
      {subscriptionActive ? <UnlimitedCredits /> : null}
    </div>
  );
};

export default UnlockPro;
