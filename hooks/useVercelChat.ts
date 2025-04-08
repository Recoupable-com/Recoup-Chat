import { Message } from "ai";
import { useChat } from "@ai-sdk/react";
import createMemory from "@/lib/createMemory";
import { usePendingMessages } from "./usePendingMessages";
import { useMessageLoader } from "./useMessageLoader";
import useRoomCreation from "./useRoomCreation";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";

interface UseVercelChatProps {
  roomId?: string;
}

/**
 * A hook that provides all chat functionality for the Vercel Chat component
 * Combines useChat, useRoomCreation, usePendingMessages, and useMessageLoader
 * Accesses user and artist data directly from providers
 */
export function useVercelChat({ roomId }: UseVercelChatProps) {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();

  const userId = userData?.id;
  const artistId = selectedArtist?.account_id;

  const { roomId: internalRoomId, createNewRoom } = useRoomCreation({
    initialRoomId: roomId,
    userId,
    artistId,
  });
  const { trackMessage } = usePendingMessages(internalRoomId);
  const { messages, append, status, stop, setMessages } = useChat({
    id: "recoup-chat", // Constant ID prevents state reset when route changes
    api: `/api/chat/vercel`,
    body: {
      roomId: internalRoomId,
    },
    onFinish: (message) => {
      if (internalRoomId) {
        // If room exists, immediately store the message
        createMemory(message, internalRoomId);
      } else {
        // Otherwise, add to pending messages
        trackMessage(message as Message);
      }
    },
    onError: () => {
      console.error("An error occurred, please try again!");
    },
  });
  const { isLoading, hasError } = useMessageLoader(
    internalRoomId,
    userId,
    setMessages
  );

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  const handleSendMessage = (content: string) => {
    const message: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date(),
    };

    // Always append message first for immediate feedback
    append(message);

    if (!internalRoomId) {
      trackMessage(message);
      createNewRoom(content);
    }
  };

  return {
    // States
    messages,
    status,
    isLoading,
    hasError,
    internalRoomId,
    isGeneratingResponse,

    // Actions
    handleSendMessage,
    stop,
  };
}
