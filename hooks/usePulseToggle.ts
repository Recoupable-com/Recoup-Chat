import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@/providers/OrganizationProvider";
import { useAccessToken } from "@/hooks/useAccessToken";
import { getPulse } from "@/lib/pulse/getPulse";
import { updatePulse } from "@/lib/pulse/updatePulse";
import { toast } from "sonner";

export function usePulseToggle() {
  const { selectedOrgId } = useOrganization();
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  const queryKey = ["pulse", selectedOrgId];

  const { data, isLoading: isInitialLoading } = useQuery({
    queryKey,
    queryFn: () =>
      getPulse({
        accessToken: accessToken!,
        accountId: selectedOrgId ?? undefined,
      }),
    enabled: !!accessToken,
  });

  const { mutate, isPending: isToggling } = useMutation({
    mutationFn: (active: boolean) =>
      updatePulse({
        accessToken: accessToken!,
        active,
        accountId: selectedOrgId ?? undefined,
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
