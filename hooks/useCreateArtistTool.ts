import { useEffect, useState } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import { CreateArtistResult } from "@/lib/tools/createArtist";
import copyMessagesClient from "@/lib/copyMessagesClient";

/**
 * Hook for managing the create artist tool result
 * Handles refreshing artists, copying messages, and navigation
 */
export function useCreateArtistTool(result: CreateArtistResult) {
  const { getArtists } = useArtistProvider();
  const { status, id } = useVercelChatContext();
  const { fetchConversations } = useConversationsProvider();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only process when streaming is finished
    const isFinishedStreaming = status === "ready";

    // Skip if no artist data or already processing
    const shouldSkip =
      !result.artist ||
      !result.artist.account_id ||
      isProcessing ||
      !isFinishedStreaming;
    if (shouldSkip) {
      return;
    }

    const processCreateArtistResult = async () => {
      try {
        setIsProcessing(true);
        console.log("Processing create artist result:", result);

        // Step 1: Refresh the artists list
        await getArtists(result.artist!.account_id);

        // Step 2: Check if we need to copy messages and redirect
        const needsRedirect = id !== result.newRoomId && !!result.newRoomId;

        if (needsRedirect && result.roomId) {
          // Copy messages from current room to the newly created room
          const success = await copyMessagesClient(
            result.roomId,
            result.newRoomId as string
          );

          // Refresh conversations to show the new chat
          await fetchConversations();

          if (success) {
            // Update the URL to point to the new conversation
            window.history.replaceState({}, "", `/chat/${result.newRoomId}`);
            setIsSuccess(true);
          } else {
            console.error("Failed to copy messages");
            setError("Failed to copy messages to the new artist");
          }
        } else {
          setIsSuccess(true);
        }
      } catch (error) {
        console.error("Error in useCreateArtistTool:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setIsProcessing(false);
      }
    };

    processCreateArtistResult();
  }, [status, result, id, isProcessing, getArtists, fetchConversations]);

  return {
    isProcessing,
    isSuccess,
    error,
  };
}

export default useCreateArtistTool;
