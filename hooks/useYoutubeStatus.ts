import { useQuery } from "@tanstack/react-query";

const useYoutubeStatus = (artistAccountId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["youtube-status", artistAccountId],
    queryFn: () => {
      return fetch(
        `/api/youtube/status?artist_account_id=${artistAccountId}`
      ).then((res) => res.json());
    },
    enabled: !!artistAccountId,
  });

  return { data, isLoading, error } as {
    data: {
        status: 'valid' | 'invalid' | 'error';
        artistAccountId: string;
        error?: string;
    } | null;
    isLoading: boolean;
    error: Error | null;
  };
};

export default useYoutubeStatus;