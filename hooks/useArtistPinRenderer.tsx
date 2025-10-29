import { ArtistRecord } from "@/types/Artist";
import Artist from "@/components/Header/Artist";

interface UseArtistPinProps {
  sorted: (ArtistRecord | null)[];
  menuExpanded: boolean;
}

export const useArtistPinRenderer = ({ sorted, menuExpanded }: UseArtistPinProps) => {
  const renderArtistListWithPins = () => {
    if (!sorted.length) return [];

    const elements: React.ReactNode[] = [];

    sorted.forEach((artist: ArtistRecord | null) => {
      if (!artist) return;

      // Add the artist
      elements.push(
        <Artist
          artist={artist}
          toggleDropDown={() => {}}
          key={artist.account_id}
          isMini={!menuExpanded}
        />
      );
    });

    return elements;
  };

  return {
    renderArtistListWithPins,
  };
};
