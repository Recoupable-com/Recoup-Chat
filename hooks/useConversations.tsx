import { useEffect, useMemo, useState } from "react";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import getConversations from "@/lib/getConversations";
import { Conversation } from "@/types/Chat";
import useArtistAgents from "./useArtistAgents";
import { ArtistAgent } from "@/lib/supabase/getArtistAgents";

const useConversations = () => {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const [allConversations, setAllConversations] = useState<
    Array<Conversation | ArtistAgent>
  >([]);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previousConversations, setPreviousConversations] = useState<Array<Conversation | ArtistAgent>>([]);
  const { agents } = useArtistAgents();

  const addConversation = (conversation: Conversation | ArtistAgent) => {
    setAllConversations((prev) => [conversation, ...prev]);
  };

  useEffect(() => {
    const accountId = userData?.id;
    if (accountId) {
      fetchConversations(accountId);
      return;
    }
    return () => setAllConversations([]);
  }, [userData, agents]);

  const conversations = useMemo(() => {
    const filtered = allConversations.filter(
      (item: Conversation | ArtistAgent) =>
        'artist_id' in item && item.artist_id === selectedArtist?.account_id
    );
    
    // Prevent empty state during artist transitions - keep previous conversations visible
    if (filtered.length === 0 && previousConversations.length > 0 && selectedArtist) {
      return previousConversations; // Keep showing previous conversations during transition
    }
    
    // Update previous conversations when we have new valid data
    if (filtered.length > 0) {
      setPreviousConversations(filtered);
    }
    
    return filtered;
  }, [selectedArtist, allConversations, previousConversations]);

  const fetchConversations = async (accountIdParam?: string) => {
    const accountId = accountIdParam ?? userData?.id;
    if (!accountId) return;
    const data = await getConversations(accountId);
    setAllConversations([...data, ...agents]);
    setIsLoading(false);
  };

  // Optimistic update helpers for creating a new chat room
  const addOptimisticConversation = (topic: string, chatId: string) => {
    if (!userData || !selectedArtist?.account_id) return null;
    // Avoid adding an optimistic conversation when a chat id already exists in the URL
    const hasChatIdInUrl =
      typeof window !== "undefined" && /\/chat\/[^\/]+/.test(window.location.pathname);
    if (hasChatIdInUrl) return null;

    const now = new Date().toISOString();

    const tempConversation: Conversation = {
      id: chatId,
      topic,
      account_id: userData.id,
      artist_id: selectedArtist.account_id,
      // Include one memory so it shows up in RecentChats filter
      memories: [
        {
          id: `${chatId}-m1`,
          content: { optimistic: true },
          room_id: chatId,
          created_at: now,
        },
      ],
      room_reports: [],
      updated_at: now,
    };

    setAllConversations((prev) => [tempConversation, ...prev]);
    return chatId;
  };

  return {
    addConversation,
    addOptimisticConversation,
    fetchConversations,
    conversations,
    setQuotaExceeded,
    quotaExceeded,
    allConversations,
    isLoading,
  };
};

export default useConversations;
