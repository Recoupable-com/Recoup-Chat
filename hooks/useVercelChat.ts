import { useChat } from "@ai-sdk/react";
import { useMessageLoader } from "./useMessageLoader";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useArtistInstruction } from "./useArtistInstruction";
import { useArtistKnowledgeText } from "./useArtistKnowledgeText";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import getEarliestFailedUserMessageId from "@/lib/messages/getEarliestFailedUserMessageId";
import { clientDeleteTrailingMessages } from "@/lib/messages/clientDeleteTrailingMessages";
import { generateUUID } from "@/lib/generateUUID";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import { UIMessage, FileUIPart } from "ai";
import useAvailableModels from "./useAvailableModels";
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_MODEL } from "@/lib/consts";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import useArtistFilesForMentions from "@/hooks/useArtistFilesForMentions";
import type { KnowledgeBaseEntry } from "@/lib/supabase/getArtistKnowledge";

// 30 days in seconds for Supabase signed URL expiry
const SIGNED_URL_EXPIRES_SECONDS = 60 * 60 * 24 * 30;

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
  const { addOptimisticConversation } = useConversationsProvider();
  const { data: availableModels = [] } = useAvailableModels();
  const [input, setInput] = useState("");
  const [model, setModel] = useLocalStorage(
    "RECOUP_MODEL",
    availableModels[0]?.id ?? ""
  );
  const { refetchCredits } = usePaymentProvider();

  // Load artist files for mentions (from Supabase)
  const { files: allArtistFiles = [] } = useArtistFilesForMentions();

  // Fetch custom artist instruction on client
  const { data: artistInstruction } = useArtistInstruction(artistId);

  // Extract mentioned file ids from input markup '@[display](id)'
  const selectedFileIds = useMemo(() => {
    const ids = new Set<string>();
    const regex = /@\[[^\]]+\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(input))) {
      if (match[1]) ids.add(match[1]);
    }
    return Array.from(ids);
  }, [input]);

  // Resolve selected files to signed URLs for attachment
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeBaseEntry[]>([]);
  const [isLoadingSignedUrls, setIsLoadingSignedUrls] = useState(false);
  // Cache signed URLs by storage_key to avoid redundant refetches
  const signedUrlCacheRef = useRef<Map<string, KnowledgeBaseEntry>>(new Map());
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!selectedFileIds.length) {
        if (!cancelled) setKnowledgeFiles((prev) => (prev.length ? [] : prev));
        if (!cancelled) setIsLoadingSignedUrls((prev) => (prev ? false : prev));
        return;
      }
      const idSet = new Set(selectedFileIds);
      const selected = allArtistFiles.filter((f) => idSet.has(f.id));
      if (selected.length === 0) {
        if (!cancelled) setKnowledgeFiles((prev) => (prev.length ? [] : prev));
        if (!cancelled) setIsLoadingSignedUrls((prev) => (prev ? false : prev));
        return;
      }
      try {
        const cache = signedUrlCacheRef.current;

        // Determine which of the selected files need fetching
        const toFetch = selected.filter((f) => !cache.has(f.storage_key));

        if (toFetch.length === 0) {
          // All selected entries are cached and valid
          const entries = selected
            .map((f) => cache.get(f.storage_key))
            .filter((e): e is KnowledgeBaseEntry => Boolean(e));
          if (!cancelled) setKnowledgeFiles(entries);
          if (!cancelled) setIsLoadingSignedUrls(false);
          return;
        }

        if (!cancelled) setIsLoadingSignedUrls(true);

        await Promise.all(
          toFetch.map(async (f) => {
            const res = await fetch(
              `/api/files/get-signed-url?key=${encodeURIComponent(f.storage_key)}&expires=${SIGNED_URL_EXPIRES_SECONDS}`
            );
            if (!res.ok) throw new Error("Failed to get signed URL");
            const { signedUrl } = (await res.json()) as { signedUrl: string };
            const entry: KnowledgeBaseEntry = {
              url: signedUrl,
              name: f.file_name,
              type: f.mime_type || "application/octet-stream",
            };
            cache.set(f.storage_key, entry);
          })
        );

        // Compose final entries in the order of selection
        const entries = selected
          .map((f) => signedUrlCacheRef.current.get(f.storage_key))
          .filter((e): e is KnowledgeBaseEntry => Boolean(e));

        if (!cancelled) setKnowledgeFiles(entries);
        if (!cancelled) setIsLoadingSignedUrls(false);
      } catch (e) {
        console.error(e);
        if (!cancelled) setKnowledgeFiles((prev) => (prev.length ? [] : prev));
        if (!cancelled) setIsLoadingSignedUrls((prev) => (prev ? false : prev));
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedFileIds, allArtistFiles]);

  // Build knowledge base text from selected files (text-like types only)
  const { data: knowledgeBaseText } = useArtistKnowledgeText(artistId, knowledgeFiles);

  // Convert selected signed files to FileUIPart attachments (pdf/images)
  const selectedFileAttachments = useMemo(() => {
    const outputs: FileUIPart[] = [];
    for (const f of knowledgeFiles) {
      if (f.type === "application/pdf" || f.type.startsWith("image")) {
        outputs.push({ type: "file", url: f.url, mediaType: f.type });
      }
    }
    return outputs;
  }, [knowledgeFiles]);

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
        artistInstruction,
        knowledgeBaseText,
      },
    }),
    [id, artistId, userId, email, model, timezone, artistInstruction, knowledgeBaseText]
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
        // Update credits after AI response completes
        await refetchCredits();
      },
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      text: input,
      files: undefined as FileUIPart[] | undefined,
    };
    const combined: FileUIPart[] = [];
    if (attachments && attachments.length > 0) combined.push(...attachments);
    if (selectedFileAttachments.length > 0) combined.push(...selectedFileAttachments);
    if (combined.length > 0) payload.files = combined;
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

  const silentlyUpdateUrl = useCallback(() => {
    window.history.replaceState({}, "", `/chat/${id}`);
  }, [id]);

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasChatApiError) {
      await deleteTrailingMessages();
    }

    // Capture the input value before it's cleared by handleSubmit
    const messageContent = input;

    // Submit the message
    handleSubmit(event);

    if (!roomId) {
      // Optimistically append a temporary conversation so it appears in Recent Chats
      // It will be replaced by the real conversation after the updates/refetch
      addOptimisticConversation("New Chat", id, messageContent);
      silentlyUpdateUrl();
    }
  };

  const handleSendQueryMessages = useCallback(async (initialMessage: UIMessage) => {
    silentlyUpdateUrl();
    sendMessage(initialMessage, chatRequestOptions);
  }, [silentlyUpdateUrl, sendMessage, chatRequestOptions]);

  useEffect(() => {
    const isFullyLoggedIn = userId;
    const isReady = status === "ready";
    const hasMessages = messages.length > 1;
    const hasInitialMessages = initialMessages && initialMessages.length > 0;
    if (!hasInitialMessages || !isReady || hasMessages || !isFullyLoggedIn)
      return;
    handleSendQueryMessages(initialMessages[0]);
  }, [initialMessages, status, userId, handleSendQueryMessages, messages.length]);

  // Sync state when models first load and prioritize preferred model
  useEffect(() => {
    if (!availableModels.length || model) return;
    const preferred = availableModels.find((m) => m.id === DEFAULT_MODEL);
    const defaultId = preferred ? preferred.id : availableModels[0].id;
    setModel(defaultId);
  }, [availableModels, model, setModel]);


  return {
    // States
    messages,
    status,
    input,
    isLoading,
    hasError,
    isGeneratingResponse,
    model,
    isLoadingSignedUrls,

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

