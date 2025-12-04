import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";
import getUserPinnedArtistIds from "@/lib/supabase/accountArtistIds/getUserPinnedArtistIds";
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

  // If filtering by a specific org, return org's artists with user's pinned status
  if (orgId) {
    const [orgArtists, pinnedIds] = await Promise.all([
      getArtistsByOrganization([orgId]),
      getUserPinnedArtistIds(accountId),
    ]);

    // Merge user's pinned preferences with org artists
    return orgArtists.map((artist) => ({
      ...artist,
      pinned: pinnedIds.has(artist.account_id),
    }));
  }

  // If orgId is explicitly null, return only personal artists (excluding org artists)
  if (orgId === null) {
    const [userArtists, userOrgs] = await Promise.all([
      getAccountArtistIds({ accountIds: [accountId] }),
      getUserOrganizations(accountId),
    ]);

    // Get all org artist IDs to exclude from personal view
    const orgIds = userOrgs.map((org) => org.organization_id);
    const orgArtists =
      orgIds.length > 0 ? await getArtistsByOrganization(orgIds) : [];
    const orgArtistIds = new Set(orgArtists.map((a) => a.account_id));

    // Return only artists NOT in any org
    return userArtists.filter((artist) => !orgArtistIds.has(artist.account_id));
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
