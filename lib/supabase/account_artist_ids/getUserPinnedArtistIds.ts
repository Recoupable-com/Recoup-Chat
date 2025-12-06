import supabase from "@/lib/supabase/serverClient";

/**
 * Get all artist IDs that a user has pinned
 * @param accountId - The user's account ID
 * @returns Set of artist IDs the user has pinned
 */
export async function getUserPinnedArtistIds(
  accountId: string
): Promise<Set<string>> {
  if (!accountId) return new Set();

  const { data, error } = await supabase
    .from("account_artist_ids")
    .select("artist_id")
    .eq("account_id", accountId)
    .eq("pinned", true);

  if (error || !data) return new Set();

  return new Set(data.map((row) => row.artist_id));
}

export default getUserPinnedArtistIds;

