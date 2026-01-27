import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@/providers/OrganizationProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useAccessToken } from "@/hooks/useAccessToken";
import { getPulse } from "@/lib/pulse/getPulse";
import { updatePulse } from "@/lib/pulse/updatePulse";
import { toast } from "sonner";

export function usePulseToggle() {
  const { selectedOrgId } = useOrganization();
  const { userData } = useUserProvider();
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  const accountId = selectedOrgId ? userData?.account_id : undefined;
  const queryKey = ["pulse", accountId];

  const { data, isLoading: isInitialLoading } = useQuery({
    queryKey,
    queryFn: () =>
      getPulse({
        accessToken: accessToken!,
        accountId,
      }),
    enabled: !!accessToken,
  });

  const { mutate, isPending: isToggling } = useMutation({
    mutationFn: (active: boolean) =>
      updatePulse({
        accessToken: accessToken!,
        active,
        accountId,
      }),
    onMutate: async (newActive) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: typeof data) =>
        old ? { ...old, pulse: { ...old.pulse, active: newActive } } : old
      );
      return { previousData };
    },
    onError: (_err, _newActive, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
      toast.error("Failed to update pulse status");
    },
    onSuccess: (data) => {
      toast.success(data.pulse.active ? "Pulse activated" : "Pulse deactivated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    active: data?.pulse?.active ?? false,
    isInitialLoading,
    isToggling,
    togglePulse: mutate,
  };
}
