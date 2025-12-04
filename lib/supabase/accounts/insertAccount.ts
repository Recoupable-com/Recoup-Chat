import supabase from "@/lib/supabase/serverClient";
import type { Tables } from "@/types/database.types";

/**
 * Insert a new account (used for customer/user accounts on login)
 * @param account Account data to insert
 * @returns Created account or null if failed
 */
const insertAccount = async (account: {
  name: string;
}): Promise<Tables<"accounts"> | null> => {
  const { data } = await supabase
    .from("accounts")
    .insert({ ...account })
    .select("*")
    .single();
  return data || null;
};

export default insertAccount;
