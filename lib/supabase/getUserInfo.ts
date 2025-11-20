import supabase from "./serverClient";

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

  // Get user account info
  const { data: accountInfo, error: accountInfoError } = await supabase
    .from("account_info")
    .select("instruction, job_title, role_type, company_name, organization, knowledges")
    .eq("account_id", accountId)
    .single();
  
  console.log("[getUserInfo] account_info query result:", { accountInfo, error: accountInfoError });

  // Get user name and email from accounts table
  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select("name, email")
    .eq("id", accountId)
    .single();
  
  console.log("[getUserInfo] accounts query result:", { account, error: accountError });

  if (!accountInfo && !account) {
    console.log("[getUserInfo] No data found, returning null");
    return null;
  }

  const userInfo = {
    name: account?.name,
    email: account?.email,
    instruction: accountInfo?.instruction,
    job_title: accountInfo?.job_title,
    role_type: accountInfo?.role_type,
    company_name: accountInfo?.company_name,
    organization: accountInfo?.organization,
    knowledges: accountInfo?.knowledges,
  };
  
  console.log("[getUserInfo] Returning user info:", JSON.stringify(userInfo, null, 2));
  return userInfo;
}

export default getUserInfo;
