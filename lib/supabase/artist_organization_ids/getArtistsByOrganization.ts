import supabase from "@/lib/supabase/serverClient";
import getFormattedArtist from "@/lib/getFormattedArtist";
import type { ArtistRecord } from "@/types/Artist";

/**
 * Get all artists that belong to an organization (or multiple organizations)
 *
 * @param organizationIds - Array of organization IDs
 * @returns Array of formatted artist objects
 */
export async function getArtistsByOrganization(
  organizationIds: string[]
): Promise<ArtistRecord[]> {
  if (!organizationIds || organizationIds.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from("artist_organization_ids")
      .select(`
        artist_id,
        artist_info:accounts!artist_organization_ids_artist_id_fkey (
          *,
          account_socials (
            *,
            social:socials (*)
          ),
          account_info (*)
        )
      `)
      .in("organization_id", organizationIds);

    if (error) {
      return [];
    }

    // Format each artist using getFormattedArtist
    // Deduplicate by artist_id in case same artist is in multiple orgs
    const artistMap = new Map<string, ArtistRecord>();
    
    (data || []).forEach((row) => {
      if (row.artist_id && !artistMap.has(row.artist_id)) {
        const formatted = getFormattedArtist(row);
        if (formatted?.account_id) {
          artistMap.set(row.artist_id, formatted);
        }
      }
    });

    return Array.from(artistMap.values());
  } catch {
    return [];
  }
}

export default getArtistsByOrganization;

