import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";
import getUserOrganizations from "@/lib/supabase/accountOrganizationIds/getUserOrganizations";
import getArtistsByOrganization from "@/lib/supabase/artistOrganizationIds/getArtistsByOrganization";
import type { ArtistRecord } from "@/types/Artist";

interface GetArtistsOptions {
  accountId: string;
  orgId?: string | null; // Filter by specific org, null = personal only, undefined = all
}

const getArtists = async (
  accountIdOrOptions: string | GetArtistsOptions
): Promise<ArtistRecord[]> => {
  // Support both old signature (string) and new signature (options object)
  const options: GetArtistsOptions =
    typeof accountIdOrOptions === "string"
      ? { accountId: accountIdOrOptions }
      : accountIdOrOptions;

  const { accountId, orgId } = options;

  // If filtering by a specific org, only return that org's artists
  if (orgId) {
    const orgArtists = await getArtistsByOrganization([orgId]);
    return orgArtists;
  }

  // If orgId is explicitly null, return only personal artists
  if (orgId === null) {
    const userArtists = await getAccountArtistIds({ accountIds: [accountId] });
    return userArtists;
  }

  // Default: return all artists (personal + all orgs)
  const [userArtists, userOrgs] = await Promise.all([
    getAccountArtistIds({ accountIds: [accountId] }),
    getUserOrganizations(accountId),
  ]);

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
