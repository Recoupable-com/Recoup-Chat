import type { Conversation } from "@/types/Chat";
import { NEW_API_BASE_URL } from "@/lib/consts";

/**
 * Fetches conversations for an account from the Recoup API.
 *
 * @param accountId - The account ID to fetch conversations for
 * @param accessToken - The Privy access token for authentication
 * @returns Array of conversations or empty array on error
 */
const getConversations = async (
  accountId: string,
  accessToken: string
): Promise<Conversation[]> => {
  if (!accountId || !accessToken) {
    return [];
  }

  try {
    const url = new URL(`${NEW_API_BASE_URL}/api/chats`);
    url.searchParams.set("account_id", accountId);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch conversations. HTTP ${response.status}: ${errorText}`
      );
      return [];
    }

    const data: { chats?: Conversation[] } = await response.json();
    return data.chats ?? [];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export default getConversations;
