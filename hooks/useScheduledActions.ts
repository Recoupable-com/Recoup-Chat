import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

interface UseScheduledActionsParams {
  accountId?: string;
  artistAccountId?: string;
}

export const useScheduledActions = ({ accountId, artistAccountId }: UseScheduledActionsParams) => {
  return useQuery<{ actions: ScheduledAction[] }>({
    queryKey: ["scheduled-actions", { accountId, artistAccountId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (accountId) params.set("accountId", accountId);
      if (artistAccountId) params.set("artistAccountIds", artistAccountId);
      
      const res = await fetch(`/api/scheduled-actions?${params.toString()}`, {
        cache: "no-store",
      });
      
      if (!res.ok) throw new Error("Failed to fetch scheduled actions");
      return res.json();
    },
    enabled: Boolean(accountId),
  });
};
