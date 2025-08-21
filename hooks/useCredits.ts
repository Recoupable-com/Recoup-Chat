import { useQuery, UseQueryResult } from "@tanstack/react-query";
import getCredits from "@/lib/supabase/getCredits";
import { useUserProvider } from "@/providers/UserProvder";
import { Tables } from "@/types/database.types";

type CreditsUsage = Tables<"credits_usage">;

const useCredits = (): UseQueryResult<CreditsUsage> => {
  const { userData } = useUserProvider();
  return useQuery({
    queryKey: ["credits", userData?.account_id],
    queryFn: () => getCredits(userData?.account_id),
    enabled: !!userData?.account_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export default useCredits;
