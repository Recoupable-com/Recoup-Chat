import { ArtistRecord } from "@/types/Artist";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Artist from "@/components/Header/Artist";

interface UseArtistPinProps {
  sorted: (ArtistRecord | null)[];
  menuExpanded: boolean;
}

export const useArtistPinRenderer = ({ sorted, menuExpanded }: UseArtistPinProps) => {
  const renderArtistListWithPins = () => {
    if (!sorted.length) return [];

    const elements: React.ReactNode[] = [];
    let hasPinnedArtists = false;
    let hasUnpinnedArtists = false;

    sorted.forEach((artist: ArtistRecord | null, index: number) => {
      if (!artist) return;

      // Check if this is the transition from pinned to unpinned
      const isPinned = artist.pinned;
      const prevArtist = index > 0 ? sorted[index - 1] : null;
      const isTransitionToUnpinned = isPinned === false && prevArtist?.pinned === true;

      // Track if we have artists in each category
      if (isPinned) hasPinnedArtists = true;
      if (!isPinned) hasUnpinnedArtists = true;

      // Add "Pinned" section header for first pinned artist
      if (isPinned && index === 0) {
        elements.push(
          <div
            key="pinned-header"
            className={cn(
              "flex items-center gap-2 mb-2 mt-1",
              menuExpanded ? "px-2" : "justify-center"
            )}
          >
            <Pin className="size-4 text-grey-dark-2 rotate-45" />
            {menuExpanded && (
              <span className="text-sm font-semibold text-grey-dark-2">
                Pinned
              </span>
            )}
          </div>
        );
      }

      // Add separator if transitioning from pinned to unpinned
      if (isTransitionToUnpinned && hasPinnedArtists && hasUnpinnedArtists) {
        elements.push(
          <Separator
            key={`separator-${index}`}
            className="my-2"
          />
        );
      }

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
