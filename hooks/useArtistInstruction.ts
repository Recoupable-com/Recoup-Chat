import { useQuery } from "@tanstack/react-query";

export function useArtistInstruction(artistId?: string) {
  return useQuery<string>({
    queryKey: ["artist-instruction", artistId],
    enabled: Boolean(artistId),
    queryFn: async () => {
      if (!artistId) return "";
      const res = await fetch(`/api/artist?artistId=${encodeURIComponent(artistId)}`);
      if (!res.ok) return "";
      const json = await res.json();
      return json?.artist?.instruction || "";
    },
    staleTime: 5 * 60 * 1000,
  });
}

export default useArtistInstruction;


