import supabase from "@/lib/supabase/serverClient";

/**
 * Check if an account is a workspace by looking for it in account_workspace_ids
 * @param accountId - The account ID to check (could be artist or workspace)
 * @returns true if the account is a workspace, false otherwise
 */
export async function isWorkspaceAccount(accountId: string): Promise<boolean> {
  if (!accountId) return false;

  try {
    const { data, error } = await supabase
      .from("account_workspace_ids")
      .select("id")
      .eq("workspace_id", accountId)
      .limit(1)
      .single();

    if (error) {
      // PGRST116 means no rows found - that's expected for non-workspaces
      if (error.code === "PGRST116") return false;
      return false;
    }

    return !!data;
  } catch {
    return false;
  }
}

export default isWorkspaceAccount;

