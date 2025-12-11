import { useUserProvider } from "@/providers/UserProvder";
import { useOrganization } from "@/providers/OrganizationProvider";
import useUserOrganizations from "@/hooks/useUserOrganizations";
import UserProfileDropdown from "./UserProfileDropdown";
import UserProfileButtonSkeleton from "./UserProfileButtonSkeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

const UserProfileButton = () => {
  const { email, userData } = useUserProvider();
  const { selectedOrgId } = useOrganization();
  const { data: organizations } = useUserOrganizations();

  if (!userData) return <UserProfileButtonSkeleton />;

  const userName = userData?.name || email || userData?.wallet || "";
  const userImage = userData?.image;

  // Find selected org
  const selectedOrg = organizations?.find(
    (org) => org.organization_id === selectedOrgId
  );

  // When org selected: show org info prominently
  // When personal: show user info prominently
  const isOrgSelected = !!selectedOrgId && !!selectedOrg;

  const primaryName = isOrgSelected
    ? selectedOrg.organization_name || "Organization"
    : userName;

  const secondaryName = isOrgSelected ? userName : "Personal";

  const avatarImage = isOrgSelected
    ? selectedOrg.organization_image
    : userImage;

  const avatarInitials = isOrgSelected
    ? (selectedOrg.organization_name || "OR").slice(0, 2).toUpperCase()
    : userName
        .split(" ")
        .map((part: string) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-full justify-start flex items-center gap-1.5 h-12 px-1.5 rounded-xl border border-transparent hover:border-muted-foreground/20 dark:hover:border-[#444] cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Open user menu"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarImage!} alt={primaryName} />
            <AvatarFallback>{avatarInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 text-left overflow-hidden">
            <p className="text-xs font-semibold truncate dark:text-white leading-tight">
              {primaryName}
            </p>
            <p
              className="text-[10px] text-muted-foreground dark:text-muted-foreground truncate leading-tight"
              title={secondaryName}
            >
              {secondaryName}
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
