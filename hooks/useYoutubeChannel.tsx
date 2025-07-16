import { YouTubeChannelResponse } from "@/types/youtube";
import { useQuery } from "@tanstack/react-query";

const useYoutubeChannel = (artistAccountId: string) => {
  const { data, isLoading, error } = useQuery<YouTubeChannelResponse>({
    queryKey: ["youtube-channel-info", artistAccountId],
    queryFn: async () => {
      const response = await fetch(
        `/api/youtube/channel-info?artist_account_id=${artistAccountId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    enabled: !!artistAccountId, // Only run query if artistAccountId is provided
  });

  return { data, isLoading, error };
};

export default useYoutubeChannel;
