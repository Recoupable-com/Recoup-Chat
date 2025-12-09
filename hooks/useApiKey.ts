import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserProvider } from "@/providers/UserProvder";
import { toast } from "sonner";
import { createApiKey } from "@/lib/keys/createApiKey";
import { fetchApiKeys, ApiKey } from "@/lib/keys/fetchApiKeys";
import { deleteApiKey } from "@/lib/keys/deleteApiKey";

interface UseApiKeyReturn {
  createApiKey: (keyName: string) => Promise<void>;
  apiKey: string | null;
  showApiKeyModal: boolean;
  setShowApiKeyModal: (show: boolean) => void;
  apiKeys: ApiKey[];
  loadingKeys: boolean;
  deleteApiKey: (keyId: string) => Promise<void>;
}

export default function useApiKey(): UseApiKeyReturn {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const { userData } = useUserProvider();
  const queryClient = useQueryClient();

  const queryKey = ["apiKeys", userData?.account_id] as const;

  const { data: apiKeys = [], isLoading: loadingKeys } = useQuery<ApiKey[]>({
    queryKey,
    queryFn: () => fetchApiKeys(userData!.account_id),
    enabled: Boolean(userData?.account_id),
  });

  const createApiKeyMutation = useMutation({
    mutationFn: ({
      keyName,
      accountId,
    }: {
      keyName: string;
      accountId: string;
    }) => createApiKey(keyName.trim(), accountId),
    onSuccess: (key) => {
      setApiKey(key);
      setShowApiKeyModal(true);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create API key");
    },
  });

  const deleteApiKeyMutation = useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      toast.success("API key deleted successfully");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete API key");
    },
  });

  const createApiKeyHandler = async (keyName: string): Promise<void> => {
    if (!userData?.account_id) {
      toast.error("Account not found. Please sign in.");
      return;
    }

    await createApiKeyMutation.mutateAsync({
      keyName,
      accountId: userData.account_id,
    });
  };

  const deleteApiKeyHandler = async (keyId: string): Promise<void> => {
    await deleteApiKeyMutation.mutateAsync(keyId);
  };

  return {
    createApiKey: createApiKeyHandler,
    apiKey,
    showApiKeyModal,
    setShowApiKeyModal,
    apiKeys,
    loadingKeys,
    deleteApiKey: deleteApiKeyHandler,
  };
}
