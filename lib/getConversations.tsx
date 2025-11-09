import type { Conversation } from "@/types/Chat";
import { AGENT_API } from "@/lib/consts";

const getConversations = async (accountId: string): Promise<Conversation[]> => {
  if (!accountId) {
    return [];
  }

  try {
    const url = new URL(`${AGENT_API}/api/chats`);
    url.searchParams.set("account_id", accountId);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
