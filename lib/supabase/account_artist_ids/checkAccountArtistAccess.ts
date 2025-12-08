import supabase from "@/lib/supabase/serverClient";

/**
 * Check if an account has access to a specific artist
 * 
 * Access is granted if:
 * 1. Account has direct access via account_artist_ids, OR
 * 2. Account and artist share an organization
 * 
 * @param accountId - The account ID to check
 * @param artistId - The artist ID to check access for
 * @returns true if the account has access to the artist, false otherwise
 */
export async function checkAccountArtistAccess(
  accountId: string,
  artistId: string
): Promise<boolean> {
  // 1. Check direct access via account_artist_ids
  const { data: directAccess } = await supabase
    .from("account_artist_ids")
    .select("artist_id")
    .eq("account_id", accountId)
    .eq("artist_id", artistId)
    .maybeSingle();

  if (directAccess) return true;

  // 2. Check organization access: user and artist share an org
  // Get all orgs the artist belongs to
  const { data: artistOrgs } = await supabase
    .from("artist_organization_ids")
    .select("organization_id")
    .eq("artist_id", artistId);

  if (!artistOrgs?.length) return false;

  // Check if user belongs to any of those orgs
  const orgIds = artistOrgs.map((o) => o.organization_id).filter(Boolean);
  if (!orgIds.length) return false;

  const { data: userOrgAccess } = await supabase
    .from("account_organization_ids")
    .select("organization_id")
    .eq("account_id", accountId)
    .in("organization_id", orgIds)
    .limit(1);

  return !!userOrgAccess?.length;
}

