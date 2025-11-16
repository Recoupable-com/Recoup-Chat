"use client";

import cn from "classnames";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import AttachmentsPreview from "./AttachmentsPreview";
import PureAttachmentsButton from "./PureAttachmentsButton";
import { motion } from "framer-motion";
import PromptSuggestions from "./PromptSuggestions";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
} from "../ai-elements/prompt-input";
import ModelSelect from "@/components/ModelSelect";
import FileMentionsInput from "./FileMentionsInput";
import authenticateGoogleSheetsToolkit from "@/lib/composio/googleSheets/authenticateGoogleSheetsToolkit";
import useUser from "@/hooks/useUser";
export function ChatInput() {
  const { selectedArtist, sorted } = useArtistProvider();
  const { userData } = useUser();
  const accountId = userData?.account_id;
  const {
    hasPendingUploads,
    messages,
    status,
    model,
    isLoadingSignedUrls,
    handleSendMessage,
    isGeneratingResponse,
    stop,
    setInput,
    input,
  } = useVercelChatContext();
  const isDisabled = !selectedArtist && sorted.length > 0;

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Allow stop action regardless of input state
    if (isGeneratingResponse) {
      stop();
      return;
    }

    // Only check input requirements for sending new messages
    if (input === "" || isDisabled || hasPendingUploads || isLoadingSignedUrls)
      return;

    handleSendMessage(event);
  };

  return (
    <div className="relative px-4">
      <div
        className={cn("w-full mx-auto", {
          "absolute bottom-[100%]": messages.length > 0,
        })}
      >
        <PromptSuggestions />
        <AttachmentsPreview />
      </div>
      <motion.div
        className="w-full relative"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <PromptInput
          onSubmit={handleSend}
          className={cn(
            "overflow-visible",
            "rounded-2xl border border-border bg-background/70 backdrop-blur",
            "shadow-sm"
          )}
        >
          <FileMentionsInput
            value={typeof input === "string" ? input : ""}
            onChange={setInput}
            disabled={isDisabled || hasPendingUploads}
            model={model}
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PureAttachmentsButton />
              {/* YouTube connect button removed from ChatInput UI intentionally; preserved for future reuse */}
              <ModelSelect />
              <button
                type="button"
                onClick={async () =>
                  await authenticateGoogleSheetsToolkit(accountId)
                }
                className="rounded-md px-2 py-1 text-xs border border-border hover:bg-accent transition-colors"
                title="Authenticate Google Sheets"
              >
                Connect Sheets
              </button>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={isDisabled || hasPendingUploads || isLoadingSignedUrls}
              status={status}
              className={cn(
                "rounded-full hover:scale-105 active:scale-95 transition-all",
                {
                  "cursor-not-allowed opacity-50":
                    isDisabled || hasPendingUploads || isLoadingSignedUrls,
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
