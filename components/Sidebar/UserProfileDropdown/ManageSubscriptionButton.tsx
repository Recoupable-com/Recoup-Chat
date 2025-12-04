import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IconCreditCard } from "@tabler/icons-react";
import useSubscribeClick from "@/hooks/useSubscribeClick";
import { usePaymentProvider } from "@/providers/PaymentProvider";

const ManageSubscriptionButton = () => {
  const { handleClick } = useSubscribeClick();
  const { isSubscribed } = usePaymentProvider();

  return (
    <DropdownMenuItem onClick={handleClick} className="cursor-pointer">
      <IconCreditCard />
      {isSubscribed ? "Billing" : "Subscribe"}
    </DropdownMenuItem>
  );
};

export default ManageSubscriptionButton;
