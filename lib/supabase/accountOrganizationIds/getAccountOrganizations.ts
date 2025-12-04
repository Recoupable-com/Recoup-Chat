import supabase from "@/lib/supabase/serverClient";

export interface AccountOrganization {
  id: string;
  organization_id: string;
  organization_name?: string;
  organization_image?: string;
}

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

  try {
    const { data, error } = await supabase
      .from("account_organization_ids")
      .select(`
        id,
        organization_id,
        organization:accounts!account_organization_ids_organization_id_fkey (
          name,
          account_info (
            image
          )
        )
      `)
      .eq("account_id", accountId);

    if (error) {
      return [];
    }

    return (data || []).map((row) => {
      const org = row.organization as { name?: string; account_info?: { image?: string }[] };
      return {
        id: row.id,
        organization_id: row.organization_id,
        organization_name: org?.name,
        organization_image: org?.account_info?.[0]?.image,
      };
    });
  } catch {
    return [];
  }
}

export default getAccountOrganizations;

