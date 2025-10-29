import { useUserProvider } from "@/providers/UserProvder";
import { ArtistRecord } from "@/types/Artist";
import { useCallback, useEffect, useState } from "react";
import useArtistSetting from "./useArtistSetting";
import { SETTING_MODE } from "@/types/Setting";
import useArtistMode from "./useArtistMode";
import saveArtist from "@/lib/saveArtist";
import useInitialArtists from "./useInitialArtists";
import useCreateArtists from "./useCreateArtists";

// Helper function to sort artists with pinned first, then alphabetically
const sortArtistsWithPinnedFirst = (artists: ArtistRecord[]): ArtistRecord[] => {
  return [...artists].sort((a, b) => {
    // First sort by pinned status (pinned artists first)
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    // Then sort alphabetically by name
    const nameA = a.name?.toLowerCase() || "";
    const nameB = b.name?.toLowerCase() || "";
    return nameA.localeCompare(nameB);
  });
};

const useArtists = () => {
  const artistSetting = useArtistSetting();
  const [isLoading, setIsLoading] = useState(true);
  const { email, userData } = useUserProvider();
  const [artists, setArtists] = useState<ArtistRecord[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<ArtistRecord | null>(
    null
  );
  const [updating, setUpdating] = useState(false);
  const loading = artistSetting.imageUploading || updating;
  const artistMode = useArtistMode(
    artistSetting.clearParams,
    artistSetting.setEditableArtist
  );
  const { handleSelectArtist } = useInitialArtists(
    artists,
    selectedArtist,
    setSelectedArtist
  );
  const [menuVisibleArtistId, setMenuVisibleArtistId] = useState<any>("");
  const { isCreatingArtist, setIsCreatingArtist, updateChatState } =
    useCreateArtists();

  const sorted = (() => {
    if (!selectedArtist) {
      return sortArtistsWithPinnedFirst(artists);
    }

    // Find the selected artist index
    const selectedIndex = artists.findIndex(
      (artist: ArtistRecord) => artist.account_id === selectedArtist.account_id
    );
    
    if (selectedIndex === -1) {
      return sortArtistsWithPinnedFirst(artists);
    }

    // Remove selected artist from the list
    const artistsWithoutSelected = [
      ...artists.slice(0, selectedIndex),
      ...artists.slice(selectedIndex + 1),
    ];

    // Sort remaining artists with pinned first
    const sortedRemaining = sortArtistsWithPinnedFirst(artistsWithoutSelected);

    // Selected artist always appears at the top of the list
    return [selectedArtist, ...sortedRemaining];
  })();

  const getArtists = useCallback(
    async (artistId?: string) => {
      if (!userData?.id) {
        setArtists([]);
        return;
      }
      const response = await fetch(
        `/api/artists?accountId=${encodeURIComponent(userData?.id as string)}`
      );
      const data = await response.json();
      setArtists(data.artists);
      if (data.artists.length === 0) {
        setSelectedArtist(null);
        setIsLoading(false);
        if (email) {
          artistMode.toggleCreation();
        }
        return;
      }
      if (artistId) {
        const newUpdatedInfo = data.artists.find(
          (artist: ArtistRecord) => artist.account_id === artistId
        );
        if (newUpdatedInfo) setSelectedArtist(newUpdatedInfo);
      }
      setIsLoading(false);
    },
    [userData]
  );

  const saveSetting = async (
    overrideKnowledges?: Array<{ name: string; url: string; type: string }>
  ) => {
    setUpdating(true);
    const saveMode = artistMode.settingMode;
    try {
      const profileUrls = {
        TWITTER: artistSetting.twitter,
        TIKTOK: artistSetting.tiktok,
        YOUTUBE: artistSetting.youtube,
        INSTAGRAM: artistSetting.instagram,
        SPOTIFY: artistSetting.spotifyUrl,
        APPLE: artistSetting.appleUrl,
      };
      const data = await saveArtist({
        name: artistSetting.name,
        image: artistSetting.image,
        profileUrls,
        instruction: artistSetting.instruction,
        label: artistSetting.label,
        knowledges: overrideKnowledges ?? artistSetting.bases,
        artistId:
          saveMode === SETTING_MODE.CREATE
            ? ""
            : artistSetting.editableArtist?.account_id,
        email,
      });
      await getArtists(data.artist?.account_id);
      setUpdating(false);
      if (artistMode.settingMode === SETTING_MODE.CREATE)
        artistMode.setSettingMode(SETTING_MODE.UPDATE);
      return data.artist;
    } catch (error) {
      console.error(error);
      setUpdating(false);
      return null;
    }
  };

  useEffect(() => {
    getArtists();
  }, [getArtists, userData]);

  return {
    sorted,
    artists,
    setArtists,
    selectedArtist,
    setSelectedArtist: handleSelectArtist,
    getArtists,
    updating,
    loading,
    saveSetting,
    ...artistSetting,
    ...artistMode,
    setMenuVisibleArtistId,
    menuVisibleArtistId,
    setIsLoading,
    isLoading,
    isCreatingArtist,
    setIsCreatingArtist,
    updateChatState,
  };
};

export default useArtists;
