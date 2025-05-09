import supabase from "../serverClient";
import type { Tables } from "@/types/database.types";

// The joined 'social' field may be any shape, so we use unknown for now
export type AccountSocialWithSocial = Tables<"account_socials"> & {
  social: Tables<"socials">;
};

const getAccountSocialsByAccountId = async (
  accountId: string
): Promise<AccountSocialWithSocial[]> => {
  const { data } = await supabase
    .from("account_socials")
    .select("*, social:socials(*)")
    .eq("account_id", accountId);
  return (data as AccountSocialWithSocial[]) || [];
};

export default getAccountSocialsByAccountId;
