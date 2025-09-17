import getAccountEmails from "@/lib/supabase/accountEmails/getAccountEmails";
import isEnterprise from "./isEnterprise";

/**
 * Returns true if the provided account ID belongs to a known enterprise domain.
 * Fetches the account's email and checks if it belongs to an enterprise domain.
 */
const isEnterpriseAccount = async (accountId: string): Promise<boolean> => {
  if (!accountId) return false;
  const emails = await getAccountEmails([accountId]);
  const email = emails[0]?.email || "";
  return isEnterprise(email);
};

export default isEnterpriseAccount;
