import extractDomain from "@/lib/email/extractDomain";
import getOrgByDomain from "@/lib/supabase/organizationDomains/getOrgByDomain";
import addUserToOrganization from "@/lib/supabase/accountOrganizationIds/addUserToOrganization";

/**
 * Auto-assign a user to their organization based on email domain.
 * Called on login to ensure users are linked to their org.
 *
 * @param accountId - The user's account ID
 * @param email - The user's email address
 * @returns The org ID if assigned, null otherwise
 */
export async function autoAssignUserToOrg(
  accountId: string,
  email: string
): Promise<string | null> {
  if (!accountId || !email) return null;

  const domain = extractDomain(email);
  if (!domain) return null;

  const orgId = await getOrgByDomain(domain);
  if (!orgId) return null;

  await addUserToOrganization(accountId, orgId);
  return orgId;
}

export default autoAssignUserToOrg;

