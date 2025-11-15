import supabase from "@/lib/supabase/serverClient";

/**
 * Check if an account has access to a specific artist
 * Queries the account_artist_ids junction table
 * 
 * @param accountId - The account ID to check
 * @param artistId - The artist ID to check access for
 * @returns true if the account has access to the artist, false otherwise
 */
export async function checkAccountArtistAccess(
  accountId: string,
  artistId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("account_artist_ids")
    .select("artist_id")
    .eq("account_id", accountId)
    .eq("artist_id", artistId)
    .maybeSingle();

  return !!data;
}

