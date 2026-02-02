import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { getSandboxes } from "@/lib/sandboxes/getSandboxes";
import type { Sandbox } from "@/lib/sandboxes/createSandbox";

interface UseSandboxesReturn {
  sandboxes: Sandbox[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export default function useSandboxes(): UseSandboxesReturn {
  const { getAccessToken, authenticated } = usePrivy();

  const query = useQuery({
    queryKey: ["sandboxes"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error("Please sign in to view sandboxes");
      }
      return getSandboxes(accessToken);
    },
    enabled: authenticated,
  });

  return {
    sandboxes: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
