import { useState } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { ArtistRecord } from "@/types/Artist";

export const useArtistPinToggle = (artist: ArtistRecord | null) => {
  const { userData } = useUserProvider();
  const { getArtists, setArtists } = useArtistProvider();
  const [isPinning, setIsPinning] = useState(false);

  const handlePinToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!artist || !userData?.id || isPinning) return;

    const newPinnedStatus = !artist.pinned;
    
    // Optimistic update - immediately update the UI
    setArtists((prevArtists: ArtistRecord[]) =>
      prevArtists.map((a: ArtistRecord) =>
        a.account_id === artist.account_id ? { ...a, pinned: newPinnedStatus } : a
      )
    );

    setIsPinning(true);
    
    try {
      const response = await fetch("/api/artist/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: userData.id,
          artistId: artist.account_id,
          pinned: newPinnedStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle pin status");
      }

      // Refetch to ensure consistency with server
      await getArtists();
    } catch (error) {
      console.error("Error toggling pin:", error);
      
      // Rollback optimistic update on error
      setArtists((prevArtists: ArtistRecord[]) =>
        prevArtists.map((a: ArtistRecord) =>
          a.account_id === artist.account_id ? { ...a, pinned: artist.pinned } : a
        )
      );
    } finally {
      setIsPinning(false);
    }
  };

  return {
    handlePinToggle,
    isPinning,
  };
};
