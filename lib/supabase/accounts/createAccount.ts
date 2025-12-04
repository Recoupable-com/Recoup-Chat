import supabase from "@/lib/supabase/serverClient";
import type { AccountType } from "@/types/AccountType";
import type { Tables } from "@/types/database.types";

/** Account row from database with account_type field */
export type AccountRow = Tables<"accounts"> & {
  account_type?: AccountType | null;
};

/**
 * Create a new account in the database
 * @param name Name of the account to create
 * @param accountType Type of account: 'customer', 'artist', 'workspace', 'organization', 'campaign'
 * @returns Created account data or null if creation failed
 */
export async function createAccount(
  name: string,
  accountType: AccountType = "artist"
): Promise<AccountRow | null> {
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

    // Cast to AccountRow since account_type column exists but isn't in generated types yet
    return data as AccountRow;
  } catch (error) {
    console.error("Unexpected error creating account:", error);
    return null;
  }
}

export default createAccount;

