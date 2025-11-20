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
  console.log("[getUserInfo] Called with accountId:", accountId);
  if (!accountId) {
    console.log("[getUserInfo] No accountId provided, returning null");
    return null;
  }

  // Get user account info - only query existing columns for now
  const { data: accountInfo, error: accountInfoError } = await supabase
    .from("account_info")
    .select("instruction, organization, knowledges")
    .eq("account_id", accountId)
    .single();
  
  console.log("[getUserInfo] account_info query result:", { accountInfo, error: accountInfoError });

  // Get user name from accounts table (email is in account_emails table)
  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select("name")
    .eq("id", accountId)
    .single();
  
  console.log("[getUserInfo] accounts query result:", { account, error: accountError });

  // Get user email from account_emails table
  const { data: accountEmail, error: emailError } = await supabase
    .from("account_emails")
    .select("email")
    .eq("account_id", accountId)
    .single();
  
  console.log("[getUserInfo] account_emails query result:", { accountEmail, error: emailError });

  if (!accountInfo && !account && !accountEmail) {
    console.log("[getUserInfo] No data found, returning null");
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
  
  console.log("[getUserInfo] Returning user info:", JSON.stringify(userInfo, null, 2));
  return userInfo;
}

export default getUserInfo;
