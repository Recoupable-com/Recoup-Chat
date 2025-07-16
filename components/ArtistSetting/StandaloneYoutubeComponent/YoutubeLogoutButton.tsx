import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
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
      queryClient.invalidateQueries({ queryKey: ["youtube-status", artistAccountId] });
      queryClient.invalidateQueries({ queryKey: ["youtube-channel-info", artistAccountId] });
    },
  });

  if (isLoading) {
    return null;
  }

  if (youtubeStatus?.status === "invalid" || youtubeStatus?.status === "error") {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 cursor-pointer absolute bottom-0 -top-3 -right-1 md:top-[-1rem]">
      <label className={"text-sm"}>&nbsp;</label>
      <Button
        size="icon"
        className="w-4 h-4 bg-transparent text-red-500 px-1 py-1 rounded-xl hover:bg-red-500 hover:text-white"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        <XIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default YoutubeLogoutButton;
