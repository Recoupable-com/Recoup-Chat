import { useMemo } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";

interface UseArtistImageResult {
  imageUrl: string | null;
  artistName: string | null;
}

export const useArtistImage = (
  artistAccountId?: string | null
): UseArtistImageResult => {
  const { artists, selectedArtist } = useArtistProvider();

  const artist = useMemo(() => {
    if (!artistAccountId) {
      return null;
    }

    const match = artists.find(
      (candidate) => candidate.account_id === artistAccountId
    );
    if (match) {
      return match;
    }

    if (selectedArtist?.account_id === artistAccountId) {
      return selectedArtist;
    }

    return null;
  }, [artistAccountId, artists, selectedArtist]);

  return {
    imageUrl: artist?.image ?? null,
    artistName: artist?.name ?? null,
  };
};

export default useArtistImage;
