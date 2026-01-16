import { useUserProvider } from "@/providers/UserProvder";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccessToken } from "@/hooks/useAccessToken";
import { NEW_API_BASE_URL } from "@/lib/consts";

export function useAgentToggleFavorite() {
  const { userData } = useUserProvider();
  const queryClient = useQueryClient();
  const accessToken = useAccessToken();

  const handleToggleFavorite = async (
    templateId: string,
    nextFavourite: boolean
  ) => {
    if (!userData?.id || !templateId) return;
    if (!accessToken) return;

    try {
      const res = await fetch(
        `${NEW_API_BASE_URL}/api/agent-templates/favorites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            templateId,
            isFavourite: nextFavourite,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to toggle favorite");
      }

      toast.success(
        nextFavourite ? "Added to favorites" : "Removed from favorites"
      );

      // Invalidate templates list so is_favourite and favorites_count refresh
      queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  return {
    handleToggleFavorite,
  };
}
