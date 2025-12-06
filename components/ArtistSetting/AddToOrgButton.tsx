"use client";

import { useState, useRef, useEffect } from "react";
import { Building2, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonPatterns } from "@/lib/styles/patterns";
import useUserOrganizations from "@/hooks/useUserOrganizations";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useOrganization } from "@/providers/OrganizationProvider";

interface AddToOrgButtonProps {
  artistId: string;
}

const AddToOrgButton = ({ artistId }: AddToOrgButtonProps) => {
  const { data: organizations } = useUserOrganizations();
  const { toggleSettingModal } = useArtistProvider();
  const { setSelectedOrgId } = useOrganization();
  const [addingToOrg, setAddingToOrg] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Don't render if user has no orgs
  if (!organizations || organizations.length === 0) {
    return null;
  }

  const handleAddToOrg = async (orgId: string) => {
    setAddingToOrg(orgId);
    try {
      const response = await fetch("/api/artist/add-to-org", {
        method: "POST",
        body: JSON.stringify({
          artistId,
          organizationId: orgId,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Close modal and switch to the org
        toggleSettingModal();
        setSelectedOrgId(orgId);
        // Artists will auto-refresh due to org change
      }
    } finally {
      setAddingToOrg(null);
    }
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-[100] py-1">
          {organizations.map((org) => (
            <button
              key={org.organization_id}
              onClick={() => handleAddToOrg(org.organization_id)}
              disabled={addingToOrg !== null}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center justify-between disabled:opacity-50"
              type="button"
            >
              <span className="truncate">
                {org.organization_name || "Unnamed"}
              </span>
              {addingToOrg === org.organization_id && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToOrgButton;

