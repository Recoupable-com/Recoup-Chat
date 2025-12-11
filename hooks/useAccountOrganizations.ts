import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useUserProvider } from "@/providers/UserProvder";
import { NEW_API_BASE_URL } from "@/lib/consts";

export interface AccountOrganization {
  id: string;
  organization_id: string;
  organization_name?: string;
  organization_image?: string;
}

interface OrganizationsResponse {
  organizations: AccountOrganization[];
}

/**
 * Fetch account's organizations from the API
 */
const fetchAccountOrganizations = async (
  accountId: string
): Promise<AccountOrganization[]> => {
  const response = await fetch(`${NEW_API_BASE_URL}/api/organizations?accountId=${accountId}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data: OrganizationsResponse = await response.json();
  return data.organizations;
};

/**
 * Hook to get all organizations the account belongs to
 */
const useAccountOrganizations = (): UseQueryResult<AccountOrganization[]> => {
  const { userData } = useUserProvider();
  return useQuery({
    queryKey: ["accountOrganizations", userData?.account_id],
    queryFn: () => fetchAccountOrganizations(userData?.account_id || ""),
    enabled: !!userData?.account_id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export default useAccountOrganizations;
