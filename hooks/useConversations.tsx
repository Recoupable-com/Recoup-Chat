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
  const { agents } = useArtistAgents();

  const addConversation = (conversation: Conversation | ArtistAgent) => {
    setAllConversations((prev) => [conversation, ...prev]);
  };

  useEffect(() => {
    if (userData) {
      fetchConversations();
      return;
    }
    return () => setAllConversations([]);
  }, [userData, agents]);

  const conversations = useMemo(() => {
    return allConversations.filter(
      (item: Conversation | ArtistAgent) =>
        'artist_id' in item && item.artist_id === selectedArtist?.account_id
    );
  }, [selectedArtist, allConversations]);

  const fetchConversations = async () => {
    const data = await getConversations(userData.id);
    setAllConversations([...data, ...agents]);
    setIsLoading(false);
  };

  // Optimistic update helpers for creating a new chat room
  const addOptimisticConversation = (topic: string, chatId: string) => {
    if (!userData || !selectedArtist?.account_id) return null;

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
