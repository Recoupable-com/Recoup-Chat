import { ArtistRecord } from "@/types/Artist";
import { Dispatch, SetStateAction, useEffect, useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";

type ArtistSelections = Record<string, ArtistRecord>;

const useInitialArtists = (
  artists: ArtistRecord[],
  selectedArtist: ArtistRecord | null,
  setSelectedArtist: Dispatch<SetStateAction<ArtistRecord | null>>,
  selectedOrgId: string | null,
) => {
  // Store all org selections in a single object
  const [selections, setSelections] = useLocalStorage<ArtistSelections>(
    "RECOUP_ARTIST_SELECTIONS",
    {}
  );

  const orgKey = selectedOrgId || "personal";

  // Save selected artist for current org
  const saveSelection = useCallback(
    (artist: ArtistRecord) => {
      setSelections((prev) => ({ ...prev, [orgKey]: artist }));
    },
    [orgKey, setSelections]
  );

  // Restore selected artist when org changes
  useEffect(() => {
    const savedArtist = selections[orgKey];
    if (savedArtist && Object.keys(savedArtist).length > 0) {
      setSelectedArtist(savedArtist);
    }
  }, [orgKey, selections, setSelectedArtist]);

  // Update selected artist with fresh data from artists list
  useEffect(() => {
    if (selectedArtist && artists.length > 0) {
      const currentArtist = artists.find(
        (artist: ArtistRecord) =>
          artist.account_id === selectedArtist.account_id,
      );
      if (currentArtist && !selectedArtist?.isWrapped) {
        setSelectedArtist(currentArtist);
        // Persist fresh data to localStorage so page reload shows updated image
        saveSelection(currentArtist);
      }
    }
  }, [artists, selectedArtist, setSelectedArtist, saveSelection]);

  const handleSelectArtist = (artist: ArtistRecord | null) => {
    setSelectedArtist(artist);
    if (artist) saveSelection(artist);
  };

  return {
    handleSelectArtist,
  };
};

export default useInitialArtists;
