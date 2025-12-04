import supabase from "@/lib/supabase/serverClient";
import type { AccountType } from "@/types/AccountType";

/**
 * Create a new account in the database
 * @param name Name of the account to create
 * @param accountType Type of account: 'customer', 'artist', 'workspace', 'organization', 'campaign'
 * @returns Created account data or null if creation failed
 */
export async function createAccount(
  name: string,
  accountType: AccountType = "artist"
) {
  try {
    const { data, error } = await supabase
      .from("accounts")
      .insert({ name, account_type: accountType })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating account:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error creating account:", error);
    return null;
  }
}

export default createAccount;

