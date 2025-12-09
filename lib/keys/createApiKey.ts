import { NEW_API_BASE_URL } from "@/lib/consts";

/**
 * Create a new API key for an account
 * @param keyName - The name for the API key
 * @param accountId - The account ID to associate the key with
 * @returns Promise with the created API key
 */
export async function createApiKey(keyName: string, accountId: string): Promise<string> {
  const response = await fetch(`${NEW_API_BASE_URL}/api/keys`, {
    method: "POST",
    body: JSON.stringify({ key_name: keyName, account_id: accountId }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || data.status === "error") {
    throw new Error(data.message || "Failed to create API key");
  }

  return data.key;
}

