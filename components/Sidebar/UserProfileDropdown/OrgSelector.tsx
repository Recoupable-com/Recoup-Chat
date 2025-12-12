import { Building2, Check, Settings, Plus } from "lucide-react";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import useAccountOrganizations from "@/hooks/useAccountOrganizations";
import { useOrganization } from "@/providers/OrganizationProvider";

const OrgSelector = () => {
  const { data: organizations, isLoading } = useAccountOrganizations();
  const { selectedOrgId, setSelectedOrgId, openOrgSettings, openCreateOrg } =
    useOrganization();

  const selectedOrg = organizations?.find(
    (org) => org.organization_id === selectedOrgId
  );

  const handleSettingsClick = (e: React.MouseEvent, orgId: string) => {
    e.stopPropagation();
    openOrgSettings(orgId);
  };

  const handleCreateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCreateOrg();
  };

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
            className="cursor-pointer group"
          >
            <span className="truncate flex-1">
              {org.organization_name || org.organization_id}
            </span>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={(e) => handleSettingsClick(e, org.organization_id)}
                className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                title="Organization Settings"
              >
                <Settings className="h-3 w-3" />
              </button>
              {selectedOrgId === org.organization_id && (
                <Check className="h-4 w-4" />
              )}
            </div>
          </DropdownMenuItem>
        ))}

        {/* Create new organization */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleCreateClick}
          className="cursor-pointer text-muted-foreground"
        >
          <Plus className="h-4 w-4" />
          <span>New Organization</span>
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

export default OrgSelector;

