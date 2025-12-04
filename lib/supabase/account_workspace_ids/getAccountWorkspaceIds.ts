import supabase from "@/lib/supabase/serverClient";
import getFormattedArtist from "@/lib/getFormattedArtist";
import type { ArtistRecord } from "@/types/Artist";

/**
 * Get all workspaces for an account, with full info
 *
 * @param accountId The owner's account ID
 * @returns Array of formatted workspace objects with isWorkspace: true
 */
export async function getAccountWorkspaceIds(
  accountId: string
): Promise<ArtistRecord[]> {
  if (!accountId) return [];

  try {
    const { data, error } = await supabase
      .from("account_workspace_ids")
      .select(`*,
        workspace_info:accounts!account_workspace_ids_workspace_id_fkey (
          *,
          account_socials (
            *,
            social:socials (*)
          ),
          account_info (*)
        )
      `)
      .eq("account_id", accountId);

    if (error) {
      console.error("Error getting account workspaces:", error);
      return [];
    }

    // Format each workspace using getFormattedArtist, then add isWorkspace flag
    return (data || []).map((row) => ({
      ...getFormattedArtist({ ...row, artist_info: row.workspace_info }),
      isWorkspace: true,
    }));
  } catch (error) {
    console.error("Unexpected error in getAccountWorkspaceIds:", error);
    return [];
  }
}

export default getAccountWorkspaceIds;

