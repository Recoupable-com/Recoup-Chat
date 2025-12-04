import { Building2, Check } from "lucide-react";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useUserOrganizations from "@/hooks/useUserOrganizations";
import { useOrganization } from "@/providers/OrganizationProvider";

const OrgSelector = () => {
  const { data: organizations, isLoading } = useUserOrganizations();
  const { selectedOrgId, setSelectedOrgId } = useOrganization();

  // Don't show if user has no organizations
  if (!isLoading && (!organizations || organizations.length === 0)) {
    return null;
  }

  const selectedOrg = organizations?.find(
    (org) => org.organization_id === selectedOrgId
  );

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="cursor-pointer">
        <Building2 className="h-4 w-4" />
        <span className="truncate">
          {isLoading
            ? "Loading..."
            : selectedOrg?.organization_name || "Personal"}
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {/* Personal account option */}
        <DropdownMenuItem
          onClick={() => setSelectedOrgId(null)}
          className="cursor-pointer"
        >
          <span>Personal</span>
          {selectedOrgId === null && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>

        {/* Organization options */}
        {organizations?.map((org) => (
          <DropdownMenuItem
            key={org.organization_id}
            onClick={() => setSelectedOrgId(org.organization_id)}
            className="cursor-pointer"
          >
            <span className="truncate">{org.organization_name || org.organization_id}</span>
            {selectedOrgId === org.organization_id && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

export default OrgSelector;

