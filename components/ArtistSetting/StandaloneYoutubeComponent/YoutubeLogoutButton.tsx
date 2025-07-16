import { Button } from "@/components/ui/button";
import { LogOut, XIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useYoutubeStatus from "@/hooks/useYoutubeStatus";

const YoutubeLogoutButton = ({
  artistAccountId,
}: {
  artistAccountId: string;
}) => {
  const { data: youtubeStatus, isLoading } = useYoutubeStatus(artistAccountId);
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/youtube/logout?artist_account_id=${artistAccountId}`, {
        method: "DELETE",
      }).then((res) => res.json()),
    onSuccess: () => {
      // Invalidate YouTube-related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["youtube-status", artistAccountId] });
      queryClient.invalidateQueries({ queryKey: ["youtube-channel-info", artistAccountId] });
    },
  });

  if (isLoading) {
    return null;
  }

  if (youtubeStatus?.status === "invalid") {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 cursor-pointer md:relative absolute bottom-0 -top-3 -right-1 md:top-0 md:right-0 md:justify-between md:pb-2">
      <label className={"text-sm"}>&nbsp;</label>
      <Button
        size="icon"
        className="md:w-9 md:h-9 w-4 h-4 bg-transparent text-red-500 md:bg-black md:text-white md:px-4 md:py-2 px-1 py-1 rounded-xl"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        <LogOut className="hidden md:block" />
        <XIcon className="md:hidden w-4 h-4" />
      </Button>
    </div>
  );
};

export default YoutubeLogoutButton;
