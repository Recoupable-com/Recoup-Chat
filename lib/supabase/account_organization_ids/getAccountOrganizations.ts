import supabase from "@/lib/supabase/serverClient";
import type { Tables } from "@/types/database.types";

/** Base row type from database schema */
type AccountOrganizationRow = Tables<"account_organization_ids">;

/** Extended type with joined organization name */
export type AccountOrganization = Pick<AccountOrganizationRow, "id" | "organization_id"> & {
  organization_name?: string;
};

/**
 * Get all organizations an account belongs to
 *
 * @param accountId - The account ID
 * @returns Array of organizations the account is a member of
 */
export async function getAccountOrganizations(
  accountId: string
): Promise<AccountOrganization[]> {
  if (!accountId) return [];

  const { data, error } = await supabase
    .from("account_organization_ids")
    .select(`
      *,
      organization:accounts!account_organization_ids_organization_id_fkey (
        name
      )
    `)
    .eq("account_id", accountId);

  if (error) return [];

  return (data || []).map((row) => ({
    id: row.id,
    organization_id: row.organization_id,
    organization_name: (row.organization as { name?: string })?.name,
  }));
}

export default getAccountOrganizations;

