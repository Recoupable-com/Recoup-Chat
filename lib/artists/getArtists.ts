import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";
import getAccountWorkspaceIds from "@/lib/supabase/accountWorkspaceIds/getAccountWorkspaceIds";
import getAccountOrganizations from "@/lib/supabase/accountOrganizationIds/getAccountOrganizations";
import getArtistsByOrganization from "@/lib/supabase/artistOrganizationIds/getArtistsByOrganization";
import type { ArtistRecord } from "@/types/Artist";

const getArtists = async (accountId: string): Promise<ArtistRecord[]> => {
  // Get account's personal artists, workspaces, and org memberships in parallel
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
