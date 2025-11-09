import { useEffect } from "react";
import {
  Conversation,
  CreateChatRequest,
  CreateChatResponse,
} from "@/types/Chat";
import type { ArtistAgent } from "@/lib/supabase/getArtistAgents";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useConversationsProvider } from "@/providers/ConversationsProvider";

const useCreateChat = ({
  isOptimisticChatItem,
  chatRoom,
  setDisplayName,
}: {
  isOptimisticChatItem: boolean;
  chatRoom: Conversation | ArtistAgent;
  setDisplayName: (displayName: string) => void;
}) => {
  const { userData, email } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { refetchConversations } = useConversationsProvider();

  useEffect(() => {
    if (!isOptimisticChatItem) return;

    const createChat = async () => {
      try {
        // Extract first message from optimistic memories
        const firstMessage = (chatRoom as Conversation).memories?.find(
          (memory) => {
            const content = memory?.content as {
              optimistic?: boolean;
              parts?: { text: string }[];
            };
            return (
              content &&
              typeof content === "object" &&
              "optimistic" in content &&
              content.optimistic === true &&
              content.parts?.[0]?.text
            );
          }
        );

        if (!firstMessage) {
          console.error("No first message found in optimistic chat");
          return;
        }

        const messageText = (
          firstMessage.content as {
            parts?: { text: string }[];
          }
        ).parts?.[0]?.text;
        if (!messageText) {
          console.error("No message text found");
          return;
        }

        const requestBody: CreateChatRequest = {
          accountId: userData?.account_id || "",
          artistId: selectedArtist?.account_id,
          chatId: (chatRoom as Conversation).id,
          firstMessage: messageText,
          email,
        };

        const response = await fetch("/api/chat/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data: CreateChatResponse = await response.json();

        if (data.success && data.room) {
          // Update display name with the room topic
          setDisplayName(data.room.topic);

          // Remove optimistic flag from memory and treat it as a normal memory.
          // It will re-enable 3 dots on the chat item.
          await refetchConversations();
        } else {
          console.error("Failed to create chat:", data.error);
        }
      } catch (error) {
        console.error("Error creating optimistic chat:", error);
      }
    };

    createChat();
  }, [
    isOptimisticChatItem,
    chatRoom,
    userData?.account_id,
    selectedArtist?.account_id,
    setDisplayName,
    email,
    refetchConversations,
  ]);
};

export default useCreateChat;
