import { useChat } from "@ai-sdk/react";
import { useMessageLoader } from "./useMessageLoader";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useArtistKnowledge } from "./useArtistKnowledge";
import { useArtistInstruction } from "./useArtistInstruction";
import { useArtistKnowledgeText } from "./useArtistKnowledgeText";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState, useRef, useMemo } from "react";
import getEarliestFailedUserMessageId from "@/lib/messages/getEarliestFailedUserMessageId";
import { clientDeleteTrailingMessages } from "@/lib/messages/clientDeleteTrailingMessages";
import { generateUUID } from "@/lib/generateUUID";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import { UIMessage, FileUIPart } from "ai";
import useAvailableModels from "./useAvailableModels";
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_MODEL } from "@/lib/consts";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import getConversations from "@/lib/getConversations";

interface UseVercelChatProps {
  id: string;
  initialMessages?: UIMessage[];
  attachments?: FileUIPart[];
}

/**
 * A hook that provides all chat functionality for the Vercel Chat component
 * Combines useChat, and useMessageLoader
 * Accesses user and artist data directly from providers
 */
export function useVercelChat({
  id,
  initialMessages,
  attachments = [],
}: UseVercelChatProps) {
  const { userData, email } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { roomId } = useParams();
  const userId = userData?.id;
  const artistId = selectedArtist?.account_id;
  const [hasChatApiError, setHasChatApiError] = useState(false);
  const messagesLengthRef = useRef<number>();
  const { fetchConversations, addOptimisticConversation, conversations } = useConversationsProvider();
  const { data: availableModels = [] } = useAvailableModels();
  const [input, setInput] = useState("");
  const [model, setModel] = useLocalStorage(
    "RECOUP_MODEL",
    availableModels[0]?.id ?? ""
  );
  const { refetchCredits } = usePaymentProvider();
  const latestChatId = typeof window !== 'undefined' 
    ? window.location.pathname.match(/\/chat\/([^\/]+)/)?.[1]
    : undefined;

  // Fetch artist knowledge on client to avoid server pre-stream lookup
  const { data: knowledgeFiles } = useArtistKnowledge(artistId);

  // Fetch custom artist instruction on client
  const { data: artistInstruction } = useArtistInstruction(artistId);

  // Build knowledge base text from client-fetched knowledge files
  const { data: knowledgeBaseText } = useArtistKnowledgeText(artistId, knowledgeFiles);

  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const chatRequestOptions = useMemo(
    () => ({
      body: {
        roomId: id,
        artistId,
        accountId: userId,
        email,
        model,
        timezone,
        knowledgeFiles,
        artistInstruction,
        knowledgeBaseText,
      },
    }),
    [id, artistId, userId, email, model, timezone, knowledgeFiles, artistInstruction, knowledgeBaseText]
  );

  const { messages, status, stop, sendMessage, setMessages, regenerate } =
    useChat({
      id,
      experimental_throttle: 100,
      generateId: generateUUID,
      onError: (e) => {
        console.error("An error occurred, please try again!", e);
        toast.error("An error occurred, please try again!");
        setHasChatApiError(true);
      },
      onFinish: async () => {
        // As onFinish triggers when a message is streamed successfully.
        // On a new chat, usually there are 2 messages:
        // 1. First user message
        // 2. Second just streamed message
        // When messages length is 2, it means second message has been streamed successfully and should also have been updated on backend
        // So we trigger the fetchConversations to update the conversation list
        if (messagesLengthRef.current === 2) {
          if (!userId) {
            pendingFetchAfterFinishRef.current = true;
          }
        }
        await refetchCredits();
      },
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      text: input,
      files: undefined as FileUIPart[] | undefined,
    };
    if (attachments && attachments.length > 0) payload.files = attachments;
    sendMessage(payload, chatRequestOptions);
    setInput("");
  };

  const append = (message: UIMessage) => {
    sendMessage(message, chatRequestOptions);
  };

  // Keep messagesRef in sync with messages
  messagesLengthRef.current = messages.length;

  const { isLoading: isMessagesLoading, hasError } = useMessageLoader(
    messages.length === 0 ? id : undefined,
    userId,
    setMessages
  );

  // If we finished streaming the first assistant message but userId wasn't ready yet,
  // refetch conversations as soon as userId becomes available.
  const pendingFetchAfterFinishRef = useRef(false);
  useEffect(() => {
    if (messagesLengthRef.current === 2) {
      if (!userId) {
        pendingFetchAfterFinishRef.current = true;
      }
    }
  }, [userId, fetchConversations]);

  // Only show loading state if:
  // 1. We're loading messages
  // 2. We have a roomId (meaning we're intentionally loading a chat)
  // 3. We don't already have messages (important for redirects)
  const isLoading = isMessagesLoading && !!id && messages.length === 0;

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  const deleteTrailingMessages = async () => {
    const earliestFailedUserMessageId =
      getEarliestFailedUserMessageId(messages);
    if (earliestFailedUserMessageId) {
      const successfulDeletion = await clientDeleteTrailingMessages({
        id: earliestFailedUserMessageId,
      });
      if (successfulDeletion) {
        setMessages((messages) => {
          const index = messages.findIndex(
            (m) => m.id === earliestFailedUserMessageId
          );
          if (index !== -1) {
            return [...messages.slice(0, index)];
          }

          return messages;
        });
      }
    }

    setHasChatApiError(false);
  };

  const silentlyUpdateUrl = () => {
    window.history.replaceState({}, "", `/chat/${id}`);
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasChatApiError) {
      await deleteTrailingMessages();
    }

    // Submit the message
    handleSubmit(event);

    if (!roomId) {
      // Optimistically append a temporary conversation so it appears in Recent Chats
      // It will be replaced by the real conversation after the updates/refetch
      addOptimisticConversation("New Chat", id);
      silentlyUpdateUrl();
    }
  };

  const handleSendQueryMessages = async (initialMessage: UIMessage) => {
    silentlyUpdateUrl();
    sendMessage(initialMessage, chatRequestOptions);
  };

  useEffect(() => {
    const isFullyLoggedIn = userId;
    const isReady = status === "ready";
    const hasMessages = messages.length > 1;
    const hasInitialMessages = initialMessages && initialMessages.length > 0;
    if (!hasInitialMessages || !isReady || hasMessages || !isFullyLoggedIn)
      return;
    handleSendQueryMessages(initialMessages[0]);
  }, [initialMessages, status, userId]);

  // Sync state when models first load and prioritize preferred model
  useEffect(() => {
    if (!availableModels.length || model) return;
    const preferred = availableModels.find((m) => m.id === DEFAULT_MODEL);
    const defaultId = preferred ? preferred.id : availableModels[0].id;
    setModel(defaultId);
  }, [availableModels, model]);

  useEffect(() => {
    if (!latestChatId || !userId) return;
    if (messagesLengthRef.current !== 2) return;

    const run = async () => {
      const exists = conversations.some(
        (c) => ("id" in c ? c.id : c.agentId) === latestChatId
      );
      if (exists) {
        const remoteRooms = await getConversations(userId);
        const existingIds = new Set(
          conversations
            .map((c) => ("id" in c ? c.id : undefined))
            .filter((id): id is string => typeof id === "string")
        );
        const hasNew = Array.isArray(remoteRooms)
          ? remoteRooms.some((r: { id?: string }) => r?.id && !existingIds.has(r.id))
          : false;
        if (hasNew) {
          await fetchConversations(userId);
        }
        return;
      }
      await fetchConversations(userId);
    };

    run();
  }, [latestChatId, userId, conversations, fetchConversations, messages.length]);

  return {
    // States
    messages,
    status,
    input,
    isLoading,
    hasError,
    isGeneratingResponse,
    model,

    // Actions
    handleSendMessage,
    setInput,
    setMessages,
    setModel,
    availableModels,
    stop,
    reload: regenerate,
    append,
  };
}
