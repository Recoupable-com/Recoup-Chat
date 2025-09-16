import { useCallback, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";
import type { ArtistAccess, AccessArtistsResponse } from "@/components/Files/types";

type AccessGrant = {
  fileId: string;
  grantedBy: string;
  invalidateKeys?: unknown[][]; // Query keys to invalidate after success
};

const useFileAccessGrant = ({ fileId, grantedBy, invalidateKeys }: AccessGrant) => {
  const [selected, setSelected] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { userData } = useUser();
  const accountId = userData?.account_id;
  const { mutate, isPending: isSavingAccess } = useMutation({
    mutationFn: async (selected: string[]) => {
      const response = await fetch("/api/files/grant-access", {
        method: "POST",
        body: JSON.stringify({ selected, fileId, grantedBy }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSelected([]);
      if (data.success) {
        const { summary } = data;
        if (summary.failed > 0) {
          toast.warning(`Access granted to ${summary.successful} artists, ${summary.failed} failed`);
        } else {
          toast.success(`Access granted to ${summary.successful} artists`);
        }
        // Invalidate provided query keys to refresh dependent views
        if (Array.isArray(invalidateKeys)) {
          for (const key of invalidateKeys) {
            if (Array.isArray(key)) {
              queryClient.invalidateQueries({ queryKey: key as readonly unknown[] });
            }
          }
        }
      } else {
        toast.error(data.message || "Failed to grant access");
      }
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to grant access";
      toast.error(errorMessage);
    },
  });

  // Fetch existing access data
  const { data: accessData, isLoading: isAccessLoading } = useQuery<AccessArtistsResponse | null>({
    queryKey: ["file-access-artists", fileId, accountId],
    queryFn: async () => {
      if (!accountId) return null;
      const res = await fetch(`/api/files/access-artists?fileId=${encodeURIComponent(fileId)}&accountId=${encodeURIComponent(accountId)}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: Boolean(fileId && accountId),
    staleTime: 30_000,
  });

  // Treat UI as loading until we have an accountId and the query has resolved
  const isUiLoading = !accountId || isAccessLoading;
  const alreadyHasAccessIds: string[] = (accessData?.data?.artists || []).map((a: ArtistAccess) => a.artistId);

  const add = useCallback(
    (id: string) =>
      setSelected((prev) => (prev.includes(id) ? prev : [...prev, id])),
    []
  );

  const remove = useCallback(
    (id: string) => setSelected((prev) => prev.filter((x) => x !== id)),
    []
  );

  const onGrant = useCallback(() => {
    console.log(selected);
    mutate(selected);
  }, [selected, mutate]);

  return {
    selected,
    add,
    remove,
    onGrant,
    isSavingAccess,
    accessData,
    isUiLoading,
    alreadyHasAccessIds,
  };
};

export default useFileAccessGrant;
