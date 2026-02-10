import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
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
  accountId: string,
  accessToken: string
): Promise<AccountOrganization[]> => {
  const response = await fetch(
    `${NEW_API_BASE_URL}/api/organizations?account_id=${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
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
  const { getAccessToken } = usePrivy();
  return useQuery({
    queryKey: ["accountOrganizations", userData?.account_id],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error("Not authenticated");
      }
      return fetchAccountOrganizations(userData?.account_id || "", accessToken);
    },
    enabled: !!userData?.account_id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export default useAccountOrganizations;
