import supabase from "@/lib/supabase/serverClient";

/**
 * Add a user to an organization
 * Used for auto-assignment on login based on email domain
 *
 * @param accountId - The user's account ID
 * @param organizationId - The organization ID to add them to
 * @returns The created record ID, or null if failed/already exists
 */
export async function addUserToOrganization(
  accountId: string,
  organizationId: string
): Promise<string | null> {
  if (!accountId || !organizationId) return null;

  try {
    // Check if already a member
    const { data: existing } = await supabase
      .from("account_organization_ids")
      .select("id")
      .eq("account_id", accountId)
      .eq("organization_id", organizationId)
      .single();

    if (existing) {
      // Already a member, return existing ID
      return existing.id;
    }

    // Add to organization
    const { data, error } = await supabase
      .from("account_organization_ids")
      .insert({
        account_id: accountId,
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

export default addUserToOrganization;

