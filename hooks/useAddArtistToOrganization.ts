import { useState, useCallback } from "react";

interface UseAddArtistToOrganizationOptions {
  onSuccess?: (orgId: string) => void;
}

/**
 * Hook to handle adding an artist to an organization.
 * Manages loading state and API call.
 */
const useAddArtistToOrganization = (options?: UseAddArtistToOrganizationOptions) => {
  const [addingToOrgId, setAddingToOrgId] = useState<string | null>(null);

  const addArtistToOrganization = useCallback(
    async (artistId: string, organizationId: string) => {
      setAddingToOrgId(organizationId);
      try {
        const response = await fetch("/api/organizations/artists", {
          method: "POST",
          body: JSON.stringify({
            artistId,
            organizationId,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          options?.onSuccess?.(organizationId);
          return true;
        }
        return false;
      } finally {
        setAddingToOrgId(null);
      }
    },
    [options]
  );

  return {
    addArtistToOrganization,
    addingToOrgId,
    isAdding: addingToOrgId !== null,
  };
};

export default useAddArtistToOrganization;

