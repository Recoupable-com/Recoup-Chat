import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IconCreditCard } from "@tabler/icons-react";
import { useUserProvider } from "@/providers/UserProvder";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import createClientPortalSession from "@/lib/stripe/createClientPortalSession";
import createClientCheckoutSession from "@/lib/stripe/createClientCheckoutSession";

const ManageSubscriptionButton = () => {
  const { userData } = useUserProvider();
  const { subscriptionActive } = usePaymentProvider();

  const handleClick = () => {
    if (!userData?.account_id) return;

    if (subscriptionActive) {
      createClientPortalSession(userData.account_id);
      return;
    }
    createClientCheckoutSession(userData.account_id);
  };

  return (
    <DropdownMenuItem onClick={handleClick} className="cursor-pointer">
      <IconCreditCard />
      {subscriptionActive ? "Manage Subscription" : "Subscribe"}
    </DropdownMenuItem>
  );
};

export default ManageSubscriptionButton;
