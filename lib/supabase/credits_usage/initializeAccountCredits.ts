import { DEFAULT_CREDITS } from "@/lib/consts";
import supabase from "../serverClient";

export const initializeAccountCredits = async (accountId: string) => {
  await supabase.from("credits_usage").insert({
    account_id: accountId,
    remaining_credits: DEFAULT_CREDITS,
  });
};
