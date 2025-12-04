import { useUserProvider } from "@/providers/UserProvder";
import { useOrganization } from "@/providers/OrganizationProvider";
import useUserOrganizations from "@/hooks/useUserOrganizations";
import UserProfileDropdown from "./UserProfileDropdown";
import UserProfileButtonSkeleton from "./UserProfileButtonSkeleton";
import CreditsProgressAvatar from "./CreditsProgressAvatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const UserProfileButton = () => {
  const { email, userData } = useUserProvider();
  const { selectedOrgId } = useOrganization();
  const { data: organizations } = useUserOrganizations();

  if (!userData) return <UserProfileButtonSkeleton />;

  const displayName = userData?.name || email || userData?.wallet || "";
  
  // Show org name or "Personal" based on selection
  const selectedOrg = organizations?.find(
    (org) => org.organization_id === selectedOrgId
  );
  const organizationLabel = selectedOrgId
    ? selectedOrg?.organization_name || "Organization"
    : "Personal";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-full justify-start flex items-center gap-1.5 h-12 px-1.5 rounded-xl border border-transparent hover:border-muted-foreground/20 dark:hover:border-[#444] cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Open user menu"
    >
      <CreditsProgressAvatar />
      <div className="flex-1 min-w-0 text-left overflow-hidden">
        <p className="text-xs font-semibold truncate dark:text-white leading-tight">
          {displayName}
        </p>
        <p className="text-[10px] text-muted-foreground dark:text-muted-foreground truncate leading-tight" title={organizationLabel}>
          {organizationLabel}
        </p>
      </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <UserProfileDropdown />
    </DropdownMenu>
  );
};

export default UserProfileButton;
