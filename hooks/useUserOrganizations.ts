import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useUserProvider } from "@/providers/UserProvder";

export interface UserOrganization {
  id: string;
  organization_id: string;
  organization_name?: string;
}

interface OrganizationsResponse {
  organizations: UserOrganization[];
}

/**
 * Fetch user's organizations from the API
 */
const fetchUserOrganizations = async (
  accountId: string
): Promise<UserOrganization[]> => {
  const response = await fetch(`/api/organizations?accountId=${accountId}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data: OrganizationsResponse = await response.json();
  return data.organizations;
};

/**
 * Hook to get all organizations the user belongs to
 */
const useUserOrganizations = (): UseQueryResult<UserOrganization[]> => {
  const { userData } = useUserProvider();
  return useQuery({
    queryKey: ["userOrganizations", userData?.account_id],
    queryFn: () => fetchUserOrganizations(userData?.account_id || ""),
    enabled: !!userData?.account_id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export default useUserOrganizations;

