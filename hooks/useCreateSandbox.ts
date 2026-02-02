import { useMutation } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";
import { createSandbox, Sandbox } from "@/lib/sandbox/createSandbox";

interface UseCreateSandboxReturn {
  createSandbox: (prompt: string) => Promise<Sandbox[]>;
  isCreating: boolean;
}

export default function useCreateSandbox(): UseCreateSandboxReturn {
  const { getAccessToken } = usePrivy();

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error("Please sign in to create a sandbox");
      }
      return createSandbox(prompt.trim(), accessToken);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create sandbox");
    },
  });

  const createSandboxHandler = async (prompt: string): Promise<Sandbox[]> => {
    return mutation.mutateAsync(prompt);
  };

  return {
    createSandbox: createSandboxHandler,
    isCreating: mutation.isPending,
  };
}
