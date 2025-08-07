"use client";

import cn from "classnames";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import AttachmentsPreview from "./AttachmentsPreview";
import PureAttachmentsButton from "./PureAttachmentsButton";
import { motion } from "framer-motion";
import { ChatInputYoutubeButton } from "./ChatInputYoutubeButton";
import PromptSuggestions from "./PromptSuggestions";
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "../ai-elements/prompt-input";
import ModelSelect from "./ModelSelect";

interface ChatInputProps {
  onSendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  isGeneratingResponse: boolean;
  onStop: () => void;
  setInput: (input: string) => void;
  input: string;
}

export function ChatInput({
  onSendMessage,
  isGeneratingResponse,
  onStop,
  setInput,
  input,
}: ChatInputProps) {
  const { selectedArtist, sorted } = useArtistProvider();
  const { hasPendingUploads, messages, status } = useVercelChatContext();
  const isDisabled = !selectedArtist && sorted.length > 0;

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (input === "" || isDisabled || hasPendingUploads) return;

    if (isGeneratingResponse) {
      onStop();
    } else {
      onSendMessage(event);
    }
  };

  return (
    <div className="relative">
      <div
        className={cn("w-full mx-auto", {
          "absolute bottom-[100%]": messages.length > 0,
        })}
      >
        <PromptSuggestions />
        <AttachmentsPreview />
      </div>
      <motion.div
        className="w-full relative p-3 dark:bg-zinc-800 rounded-2xl flex flex-col gap-1 bg-zinc-100"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <PromptInput onSubmit={handleSend}>
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isDisabled || hasPendingUploads}
            className="h-10"
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputButton className="hover:scale-105 active:scale-95 transition-all">
                <PureAttachmentsButton />
              </PromptInputButton>
              <PromptInputButton className="rounded-full hover:scale-105 active:scale-95 transition-all">
                <ChatInputYoutubeButton />
              </PromptInputButton>
              <ModelSelect />
            </PromptInputTools>
            <PromptInputSubmit
              disabled={isDisabled || hasPendingUploads}
              status={status}
              className={cn(
                "rounded-full hover:scale-105 active:scale-95 transition-all",
                {
                  "cursor-not-allowed opacity-50":
                    isDisabled || hasPendingUploads,
                }
              )}
            />
          </PromptInputToolbar>
        </PromptInput>
      </motion.div>
    </div>
  );
}

export default ChatInput;
