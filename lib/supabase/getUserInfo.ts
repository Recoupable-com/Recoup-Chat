import supabase from "./serverClient";

// NOTE: Migration needed! Run the migration at:
// supabase/migrations/20251120000000_add_onboarding_to_account_info.sql
// to add job_title, role_type, company_name columns

export interface UserInfo {
  name?: string;
  email?: string;
  instruction?: string;
  job_title?: string;
  role_type?: string;
  company_name?: string;
  organization?: string;
  knowledges?: unknown[];
}

/**
 * Gets the full user information from account_info and accounts tables
 * @param accountId The user's account ID
 * @returns The user info object or null if not found
 */
async function getUserInfo(accountId: string): Promise<UserInfo | null> {
  if (!accountId) {
    return null;
  }

  // Get user account info - only query existing columns for now
  const { data: accountInfo } = await supabase
    .from("account_info")
    .select("instruction, organization, knowledges")
    .eq("account_id", accountId)
    .single();
  
  // Get user name from accounts table (email is in account_emails table)
  const { data: account } = await supabase
    .from("accounts")
    .select("name")
    .eq("id", accountId)
    .single();
  
  // Get user email from account_emails table
  const { data: accountEmail } = await supabase
    .from("account_emails")
    .select("email")
    .eq("account_id", accountId)
    .single();

  if (!accountInfo && !account && !accountEmail) {
    return null;
  }

  const userInfo = {
    name: account?.name,
    email: accountEmail?.email,
    instruction: accountInfo?.instruction,
    job_title: undefined, // Will be available after migration
    role_type: undefined, // Will be available after migration
    company_name: undefined, // Will be available after migration
    organization: accountInfo?.organization,
    knowledges: accountInfo?.knowledges,
  };
  
  return userInfo;
}

export default getUserInfo;
