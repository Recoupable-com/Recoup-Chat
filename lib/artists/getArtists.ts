import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";
import getUserOrganizations from "@/lib/supabase/accountOrganizationIds/getUserOrganizations";
import getArtistsByOrganization from "@/lib/supabase/artistOrganizationIds/getArtistsByOrganization";
import isEnterpriseAccount from "@/lib/recoup/isEnterpriseAccount";
import type { ArtistRecord } from "@/types/Artist";
import { ROSTRUM_ORG_ARTIST_IDS } from "../consts";

const getArtists = async (accountId: string): Promise<ArtistRecord[]> => {
  // Get user's personal artists and org memberships in parallel
  const [userArtists, userOrgs] = await Promise.all([
    getAccountArtistIds({ accountIds: [accountId] }),
    getUserOrganizations(accountId),
  ]);

  // Get artists from all orgs the user belongs to
  const orgIds = userOrgs.map((org) => org.organization_id);
  const orgArtists = orgIds.length > 0
    ? await getArtistsByOrganization(orgIds)
    : [];

  // Fallback: if user has no org artists but is enterprise, use hardcoded list
  const fallbackArtists =
    orgArtists.length === 0 && ROSTRUM_ORG_ARTIST_IDS.length > 0
      ? await getFallbackArtists(accountId)
      : [];

  // Deduplicate by account_id
  const uniqueByAccountId = new Map<string, ArtistRecord>();
  [...userArtists, ...orgArtists, ...fallbackArtists].forEach((artist) => {
    if (artist?.account_id && !uniqueByAccountId.has(artist.account_id)) {
      uniqueByAccountId.set(artist.account_id, artist);
    }
  });

  return Array.from(uniqueByAccountId.values());
};

/**
 * Fallback to hardcoded artist list for enterprise users
 * Remove this once all enterprise artists are seeded in artist_organization_ids
 */
async function getFallbackArtists(accountId: string): Promise<ArtistRecord[]> {
  const enterprise = await isEnterpriseAccount(accountId);
  if (!enterprise) return [];
  return getAccountArtistIds({ artistIds: ROSTRUM_ORG_ARTIST_IDS });
}

export default getArtists;
