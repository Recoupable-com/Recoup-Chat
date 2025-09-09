import supabase from "../serverClient";

export const getAccountWithDetails = async (accountId: string) => {
  const { data: account } = await supabase
    .from("accounts")
    .select("*, account_info(*), account_emails(*), account_wallets(*)")
    .eq("id", accountId)
    .single();

  if (!account) {
    throw new Error("Account not found");
  }

  return {
    ...account.account_info[0],
    ...account.account_emails[0],
    ...account.account_wallets[0],
    ...account,
  };
};
