import { ArtistRecord } from "@/types/Artist";
import { Dispatch, SetStateAction, useEffect, useCallback, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

type ArtistSelections = Record<string, ArtistRecord>;

const useInitialArtists = (
  artists: ArtistRecord[],
  selectedArtist: ArtistRecord | null,
  setSelectedArtist: Dispatch<SetStateAction<ArtistRecord | null>>,
  selectedOrgId: string | null,
) => {
  const [selections, setSelections] = useLocalStorage<ArtistSelections>(
    "RECOUP_ARTIST_SELECTIONS",
    {}
  );

  const orgKey = selectedOrgId || "personal";

  const validArtistIds = useMemo(
    () => new Set(artists.map((a) => a.account_id)),
    [artists]
  );

  const saveSelection = useCallback(
    (artist: ArtistRecord) => {
      setSelections((prev) => ({ ...prev, [orgKey]: artist }));
    },
    [orgKey, setSelections]
  );

  // Restore saved artist only if it belongs to current org
  useEffect(() => {
    if (artists.length === 0) return;

    const savedArtist = selections[orgKey];
    if (savedArtist && Object.keys(savedArtist).length > 0) {
      if (validArtistIds.has(savedArtist.account_id)) {
        if (savedArtist.account_id !== selectedArtist?.account_id) {
          setSelectedArtist(savedArtist);
        }
      }
    }
  }, [orgKey, selections, selectedArtist?.account_id, setSelectedArtist, artists.length, validArtistIds]);

  // Sync selection with fresh artist data, clear if artist left current org or was deleted
  useEffect(() => {
    if (!selectedArtist) return;

    const currentArtist = artists.find(
      (artist: ArtistRecord) =>
        artist.account_id === selectedArtist.account_id,
    );

    if (!currentArtist) {
      setSelectedArtist(null);
    } else if (!selectedArtist?.isWrapped) {
      setSelectedArtist(currentArtist);
      saveSelection(currentArtist);
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
