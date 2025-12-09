"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { Building2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonPatterns } from "@/lib/styles/patterns";
import useUserOrganizations from "@/hooks/useUserOrganizations";
import useAddArtistToOrganization from "@/hooks/useAddArtistToOrganization";
import useClickOutside from "@/hooks/useClickOutside";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useOrganization } from "@/providers/OrganizationProvider";
import OrganizationButton from "./OrganizationButton";

interface AddToOrgButtonProps {
  artistId: string;
}

const AddToOrgButton = ({ artistId }: AddToOrgButtonProps) => {
  const { data: organizations } = useUserOrganizations();
  const { toggleSettingModal } = useArtistProvider();
  const { setSelectedOrgId } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoize callbacks to prevent hook recreation
  const hookOptions = useMemo(
    () => ({
      onSuccess: (orgId: string) => {
        toggleSettingModal();
        setSelectedOrgId(orgId);
      },
    }),
    [toggleSettingModal, setSelectedOrgId]
  );

  const { addArtistToOrganization, addingToOrgId, isAdding } =
    useAddArtistToOrganization(hookOptions);

  // Close dropdown when clicking outside
  const closeDropdown = useCallback(() => setIsOpen(false), []);
  useClickOutside(dropdownRef, closeDropdown, isOpen);

  // Don't render if user has no orgs
  if (!organizations || organizations.length === 0) {
    return null;
  }

  const handleAddToOrg = (orgId: string) => {
    addArtistToOrganization(artistId, orgId);
  };

  return (
    <div className="col-span-12 relative" ref={dropdownRef}>
      <button
        className={cn(buttonPatterns.secondary, "w-full py-2 flex items-center justify-center gap-2")}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Building2 className="h-4 w-4" />
        Add to Organization
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-100 py-1">
          {organizations.map((org) => (
            <OrganizationButton
              key={org.organization_id}
              organizationId={org.organization_id}
              organizationName={org.organization_name}
              isLoading={addingToOrgId === org.organization_id}
              disabled={isAdding}
              onClick={() => handleAddToOrg(org.organization_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToOrgButton;

