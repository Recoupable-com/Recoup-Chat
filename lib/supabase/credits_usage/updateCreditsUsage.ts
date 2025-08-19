import serverClient from "../serverClient";
import { CreditsUsage } from "./selectCreditsUsage";

interface UpdateCreditsUsageParams {
  account_id: string;
  updates: Partial<Omit<CreditsUsage, "account_id">>;
}

export const updateCreditsUsage = async ({
  account_id,
  updates,
}: UpdateCreditsUsageParams): Promise<CreditsUsage> => {
  const { data, error } = await serverClient
    .from("credits_usage")
    .update(updates)
    .eq("account_id", account_id)
    .select()
    .single();

  if (error) {
    console.error("Error updating credits usage:", error);
    throw error;
  }

  if (!data) {
    throw new Error(`No credits usage found for account_id: ${account_id}`);
  }

  return data;
};
