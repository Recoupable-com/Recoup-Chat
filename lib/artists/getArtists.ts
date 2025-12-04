import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";
import getUserOrganizations from "@/lib/supabase/accountOrganizationIds/getUserOrganizations";
import getArtistsByOrganization from "@/lib/supabase/artistOrganizationIds/getArtistsByOrganization";
import type { ArtistRecord } from "@/types/Artist";

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

  // Deduplicate by account_id
  const uniqueByAccountId = new Map<string, ArtistRecord>();
  [...userArtists, ...orgArtists].forEach((artist) => {
    if (artist?.account_id && !uniqueByAccountId.has(artist.account_id)) {
      uniqueByAccountId.set(artist.account_id, artist);
    }
  });

  return Array.from(uniqueByAccountId.values());
};

export default getArtists;
