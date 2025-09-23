import supabase from "@/lib/supabase/serverClient";

interface ToggleArtistPinParams {
  accountId: string;
  artistId: string;
  pinned: boolean;
}

export const toggleArtistPin = async ({
  accountId,
  artistId,
  pinned,
}: ToggleArtistPinParams) => {
  const { error } = await supabase
    .from("account_artist_ids")
    .update({ pinned })
    .eq("account_id", accountId)
    .eq("artist_id", artistId);

  if (error) {
    console.error("Error updating pinned status:", error);
    throw new Error("Failed to update pinned status");
  }

  return { success: true, pinned };
};

export default toggleArtistPin;
