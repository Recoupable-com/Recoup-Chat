import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getCatalogs, CatalogsResponse } from "@/lib/catalog/getCatalogs";
import { useUserProvider } from "@/providers/UserProvder";

const useCatalogs = (): UseQueryResult<CatalogsResponse> => {
  const { userData } = useUserProvider();
  const accountId = userData?.account_id || "";

  return useQuery({
    queryKey: ["catalogs", accountId],
    queryFn: () => getCatalogs(accountId),
    enabled: !!accountId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useCatalogs;
