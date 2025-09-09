import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { useUserProvider } from "@/providers/UserProvder";
import CreditsUsage from "./CreditsUsage";
import AccountIdDisplay from "@/components/ArtistSetting/AccountIdDisplay";
import ManageSubscriptionButton from "./ManageSubscriptionButton";

const UserProfileDropdown = () => {
  const { toggleModal, signOut, userData } = useUserProvider();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0">
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="text-sm font-semibold">
          My Account
        </DropdownMenuLabel>
        {userData?.account_id && (
          <div className="px-2 py-1.5">
            <AccountIdDisplay
              accountId={userData.account_id}
              label="Account ID"
            />
          </div>
        )}
        <CreditsUsage />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={toggleModal} className="cursor-pointer">
            <IconUser />
            Profile
          </DropdownMenuItem>
          <ManageSubscriptionButton />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
