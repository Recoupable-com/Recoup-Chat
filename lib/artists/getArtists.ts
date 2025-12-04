import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";
import getUserPinnedArtistIds from "@/lib/supabase/accountArtistIds/getUserPinnedArtistIds";
import getAccountWorkspaceIds from "@/lib/supabase/accountWorkspaceIds/getAccountWorkspaceIds";
import getAccountOrganizations from "@/lib/supabase/accountOrganizationIds/getAccountOrganizations";
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

  // If filtering by a specific org, return org's artists with account's pinned status
  if (orgId) {
    const [orgArtists, pinnedIds] = await Promise.all([
      getArtistsByOrganization([orgId]),
      getUserPinnedArtistIds(accountId),
    ]);

    // Merge account's pinned preferences with org artists
    return orgArtists.map((artist) => ({
      ...artist,
      pinned: pinnedIds.has(artist.account_id),
    }));
  }

  // If orgId is explicitly null, return only personal artists + workspaces (excluding org artists)
  if (orgId === null) {
    const [accountArtists, accountWorkspaces, accountOrgs] = await Promise.all([
      getAccountArtistIds({ accountIds: [accountId] }),
      getAccountWorkspaceIds(accountId),
      getAccountOrganizations(accountId),
    ]);

    // Get all org artist IDs to exclude from personal view
    const orgIds = accountOrgs.map((org) => org.organization_id);
    const orgArtists =
      orgIds.length > 0 ? await getArtistsByOrganization(orgIds) : [];
    const orgArtistIds = new Set(orgArtists.map((a) => a.account_id));

    // Return only artists + workspaces NOT in any org
    const personalEntities = [...accountArtists, ...accountWorkspaces];
    return personalEntities.filter((entity) => !orgArtistIds.has(entity.account_id));
  }

  // Default: return all artists + workspaces (personal + all orgs)
  const [accountArtists, accountWorkspaces, accountOrgs] = await Promise.all([
    getAccountArtistIds({ accountIds: [accountId] }),
    getAccountWorkspaceIds(accountId),
    getAccountOrganizations(accountId),
  ]);

  // Get artists from all orgs the account belongs to
  const orgIds = accountOrgs.map((org) => org.organization_id);
  const orgArtists = orgIds.length > 0
    ? await getArtistsByOrganization(orgIds)
    : [];

  // Combine all: personal artists + workspaces + org artists
  // Deduplicate by account_id
  const uniqueByAccountId = new Map<string, ArtistRecord>();
  [...accountArtists, ...accountWorkspaces, ...orgArtists].forEach((entity) => {
    if (entity?.account_id && !uniqueByAccountId.has(entity.account_id)) {
      uniqueByAccountId.set(entity.account_id, entity);
    }
  });

  return Array.from(uniqueByAccountId.values());
};

export default getArtists;
