import { Moon, Sun, Monitor } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { useUserProvider } from "@/providers/UserProvder";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import CreditsUsage from "./CreditsUsage";
import AccountIdDisplay from "@/components/ArtistSetting/AccountIdDisplay";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import ConnectorsMenuItem from "./ConnectorsMenuItem";
import OrgSelector from "./OrgSelector";
import { useTheme } from "next-themes";
import { Check } from "lucide-react";

const UserProfileDropdown = () => {
  const { toggleModal, signOut, userData } = useUserProvider();
  const { isSubscribed } = usePaymentProvider();
  const { theme, setTheme } = useTheme();

  const getThemeIcon = () => {
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    if (theme === "light") return <Sun className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="text-sm font-semibold">
          My Account
        </DropdownMenuLabel>
        {isSubscribed && (
          <div className="px-2 pb-1">
            <div className="text-[10px] font-medium rounded-md bg-muted text-foreground px-2 py-1 text-center border border-border">
              Recoupable Pro: Active
            </div>
          </div>
        )}
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
          <OrgSelector />
          <ManageSubscriptionButton />
          <ConnectorsMenuItem />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              {getThemeIcon()}
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                onClick={() => setTheme("light")} 
                className="cursor-pointer"
              >
                <Sun className="h-4 w-4" />
                <span>Light</span>
                {theme === "light" && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTheme("dark")} 
                className="cursor-pointer"
              >
                <Moon className="h-4 w-4" />
                <span>Dark</span>
                {theme === "dark" && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTheme("system")} 
                className="cursor-pointer"
              >
                <Monitor className="h-4 w-4" />
                <span>System</span>
                {theme === "system" && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
  );
};

export default UserProfileDropdown;
