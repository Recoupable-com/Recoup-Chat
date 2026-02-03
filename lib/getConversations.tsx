import type { Conversation } from "@/types/Chat";
import { NEW_API_BASE_URL } from "@/lib/consts";

/**
 * Fetches conversations from the Recoup API.
 *
 * Authentication is via Bearer token (Privy access token).
 * The account is automatically inferred from the authentication token.
 *
 * Note: account_id query parameter is intentionally NOT passed because
 * personal Bearer tokens cannot use this filter (returns 403). Only
 * organization API keys can filter by account_id.
 *
 * @see https://developers.recoupable.com/api-reference/chat/chats
 *
 * @param accessToken - The Privy access token for authentication
 * @returns Array of conversations or empty array on error
 */
const getConversations = async (
  accessToken: string
): Promise<Conversation[]> => {
  if (!accessToken) {
    return [];
  }

  try {
    const url = `${NEW_API_BASE_URL}/api/chats`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
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
