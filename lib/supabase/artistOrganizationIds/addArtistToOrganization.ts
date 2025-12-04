import supabase from "@/lib/supabase/serverClient";

/**
 * Add an artist to an organization
 * Used when creating new artists to auto-link them to the user's org
 *
 * @param artistId - The artist's account ID
 * @param organizationId - The organization ID to add them to
 * @returns The created record ID, or null if failed/already exists
 */
export async function addArtistToOrganization(
  artistId: string,
  organizationId: string
): Promise<string | null> {
  if (!artistId || !organizationId) return null;

  try {
    // Check if already linked
    const { data: existing } = await supabase
      .from("artist_organization_ids")
      .select("id")
      .eq("artist_id", artistId)
      .eq("organization_id", organizationId)
      .single();

    if (existing) {
      // Already linked, return existing ID
      return existing.id;
    }

    // Add to organization
    const { data, error } = await supabase
      .from("artist_organization_ids")
      .insert({
        artist_id: artistId,
        organization_id: organizationId,
      })
      .select("id")
      .single();

    if (error) {
      return null;
    }

    return data?.id || null;
  } catch {
    return null;
  }
}

export default addArtistToOrganization;

