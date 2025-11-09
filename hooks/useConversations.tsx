import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import getConversations from "@/lib/getConversations";
import { Conversation } from "@/types/Chat";
import useArtistAgents from "./useArtistAgents";
import { ArtistAgent } from "@/lib/supabase/getArtistAgents";

const useConversations = () => {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { agents } = useArtistAgents();
  const queryClient = useQueryClient();

  const accountId = userData?.id;
  const queryKey = useMemo(
    () => ["conversations", accountId] as const,
    [accountId]
  );

  const {
    data: fetchedConversations = [],
    isLoading,
    refetch,
  } = useQuery<Conversation[]>({
    queryKey,
    queryFn: () => getConversations(accountId as string),
    enabled: Boolean(accountId),
    initialData: [],
  });

  const combinedConversations = useMemo<
    Array<Conversation | ArtistAgent>
  >(() => {
    return [...fetchedConversations, ...agents];
  }, [fetchedConversations, agents]);

  const conversations = useMemo(() => {
    return combinedConversations.filter(
      (item: Conversation | ArtistAgent) =>
        "artist_id" in item && item.artist_id === selectedArtist?.account_id
    );
  }, [selectedArtist, combinedConversations]);

  // Optimistic update helpers for creating a new chat room
  const addOptimisticConversation = (
    topic: string,
    chatId: string,
    message?: string
  ) => {
    if (!userData || !selectedArtist?.account_id) return null;
    // Avoid adding an optimistic conversation when a chat id already exists in the URL
    const hasChatIdInUrl =
      typeof window !== "undefined" &&
      /\/chat\/[^\/]+/.test(window.location.pathname);
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
          content: {
            optimistic: true,
            parts: message ? [{ text: message }] : [],
          },
          room_id: chatId,
          created_at: now,
        },
      ],
      room_reports: [],
      updated_at: now,
    };

    queryClient.setQueryData<Conversation[]>(queryKey, (prev = []) => [
      tempConversation,
      ...prev,
    ]);
    return chatId;
  };

  return {
    addOptimisticConversation,
    refetchConversations: refetch,
    conversations,
    isLoading,
  };
};

export default useConversations;
