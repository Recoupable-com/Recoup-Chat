import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type AccessGrant = {
  fileId: string;
  grantedBy: string;
};

const useFileAccessGrant = ({ fileId, grantedBy }: AccessGrant) => {
  const [selected, setSelected] = useState<string[]>([]);
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
      } else {
        toast.error(data.message || "Failed to grant access");
      }
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to grant access";
      toast.error(errorMessage);
    },
  });

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
  };
};

export default useFileAccessGrant;
