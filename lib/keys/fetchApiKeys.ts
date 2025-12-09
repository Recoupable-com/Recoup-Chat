import { NEW_API_BASE_URL } from "@/lib/consts";
import { Tables } from "@/types/database.types";

export type ApiKey = Tables<"account_api_keys">;

/**
 * Fetch API keys for an account
 * @param accountId - The account ID to retrieve API keys for
 * @returns Promise with the list of API keys
 */
export async function fetchApiKeys(accountId: string): Promise<ApiKey[]> {
  const response = await fetch(
    `${NEW_API_BASE_URL}/api/keys?account_id=${accountId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok || data.status === "error") {
    throw new Error(data.message || "Failed to fetch API keys");
  }

  return data.keys || [];
}
