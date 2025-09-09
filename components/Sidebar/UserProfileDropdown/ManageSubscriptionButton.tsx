import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IconCreditCard } from "@tabler/icons-react";
import { useUserProvider } from "@/providers/UserProvder";
import createClientPortalSession from "@/lib/stripe/createClientPortalSession";

const ManageSubscriptionButton = () => {
  const { userData } = useUserProvider();

  const handleManageSubscription = () => {
    if (userData?.account_id) {
      createClientPortalSession(userData.account_id);
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleManageSubscription}
      className="cursor-pointer"
    >
      <IconCreditCard />
      Manage Subscription
    </DropdownMenuItem>
  );
};

export default ManageSubscriptionButton;
