"use client";

import cn from "classnames";
import { useEffect, useMemo, useState } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import AttachmentsPreview from "./AttachmentsPreview";
import PureAttachmentsButton from "./PureAttachmentsButton";
import { motion } from "framer-motion";
import PromptSuggestions from "./PromptSuggestions";
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
} from "../ai-elements/prompt-input";
import ModelSelect from "@/components/ModelSelect";
import { MentionsInput, Mention, OnChangeHandlerFunc, SuggestionDataItem } from "react-mentions";
import { Card } from "@/components/ui/card";
import { useArtistKnowledge } from "@/hooks/useArtistKnowledge";

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
  const { hasPendingUploads, messages, status, model } = useVercelChatContext();
  const isDisabled = !selectedArtist && sorted.length > 0;
  const [portalHost, setPortalHost] = useState<Element | undefined>(undefined);
  useEffect(() => {
    if (typeof window !== "undefined") setPortalHost(document.body);
  }, []);
  
  // Load artist knowledge files
  const artistId = selectedArtist?.account_id;
  const { data: knowledgeFiles = [] } = useArtistKnowledge(artistId);
  const mentionOptions = useMemo(() => {
    return (knowledgeFiles || [])
      .filter((f) => typeof f?.url === "string" && !!f.url)
      .map((f) => ({ id: String(f.url), display: String(f.name || f.url) })) as SuggestionDataItem[];
  }, [knowledgeFiles]);

  // Parse already mentioned ids from markup '@[__display__](__id__)'
  const mentionedIds = useMemo(() => {
    const ids = new Set<string>();
    const value = typeof input === "string" ? input : "";
    const regex = /@\[[^\]]+\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(value))) {
      if (match[1]) ids.add(match[1]);
    }
    return ids;
  }, [input]);

  const handleMentionsChange: OnChangeHandlerFunc = (
    _event,
    newValue
  ) => {
    // Store markup value so the UI preserves highlighted mentions
    setInput(newValue);
  };


  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Allow stop action regardless of input state
    if (isGeneratingResponse) {
      onStop();
      return;
    }

    // Only check input requirements for sending new messages
    if (input === "" || isDisabled || hasPendingUploads) return;

    onSendMessage(event);
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
        className="w-full relative"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <PromptInput
          onSubmit={handleSend}
          className={cn(
            "overflow-visible md:overflow-hidden",
            "rounded-2xl border bg-background/70 backdrop-blur",
            "shadow-sm"
          )}
        >
          <MentionsInput
            value={typeof input === "string" ? input : ""}
            onChange={handleMentionsChange}
            disabled={isDisabled || hasPendingUploads}
            className="w-full text-[14px] leading-[1.6] pb-2 md:pb-0"
            suggestionsPortalHost={portalHost}
            allowSuggestionsAboveCursor
            customSuggestionsContainer={(children) => (
              <Card
                className="z-[70] shadow-lg border rounded-xl overflow-hidden p-1"
                style={{ background: "hsl(var(--background))", minWidth: 320, maxHeight: 360, overflow: "auto" }}
              >
                {children}
              </Card>
            )}
            placeholder={
              model === "fal-ai/nano-banana/edit"
                ? "Describe an image or upload a file to edit..."
                : "What would you like to know? Type @ to attach files"
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const form = (e.target as HTMLTextAreaElement)?.form;
                if (form) form.requestSubmit();
              }
            }}
            style={{
              control: {
                minHeight: 44,
                border: "none",
                outline: "none",
                background: "transparent",
                width: "100%",
              },
              "&multiLine": {
                highlighter: {
                  padding: "12px 20px",
                  fontSize: 14,
                  lineHeight: 1.6,
                  maxHeight: 180,
                  overflow: "hidden",
                },
                input: {
                  padding: "12px 20px",
                  outline: "none",
                  fontSize: 14,
                  lineHeight: 1.6,
                  minHeight: 44,
                  maxHeight: 180,
                  overflowY: "auto",
                  resize: "none",
                  boxSizing: "border-box",
                },
              },
              "&singleLine": {
                highlighter: {
                  padding: "12px 20px",
                  fontSize: 14,
                  lineHeight: 1.6,
                },
                input: {
                  padding: "12px 20px",
                  outline: "none",
                  fontSize: 14,
                  lineHeight: 1.6,
                },
              },
            }}
          >
            <Mention
              trigger="@"
              markup='@[__display__](__id__)'
              data={(query: string, callback: (results: SuggestionDataItem[]) => void) => {
                const q = (query || "").toLowerCase();
                const results = mentionOptions
                  .filter((f) => !mentionedIds.has(String(f.id)))
                  .filter((f) => (f.display ?? String(f.id)).toLowerCase().includes(q));
                callback(results as SuggestionDataItem[]);
              }}
              displayTransform={(_id: string, display: string) => display}
              appendSpaceOnAdd
              style={{
                backgroundColor: "rgb(0 0 0 / 0.25)",
                borderRadius: 6,
              }}
              renderSuggestion={(
                entry: SuggestionDataItem,
                _search: string,
                highlightedDisplay: React.ReactNode,
                _index: number,
                focused: boolean
              ) => (
                <div
                  className={cn(
                    "px-3 py-2 text-[13px] cursor-pointer select-none",
                    "flex items-center gap-2 rounded-md",
                    focused ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="size-2 rounded-full bg-primary/60" />
                  <span className="truncate">{highlightedDisplay || entry.display}</span>
                </div>
              )}
            />
          </MentionsInput>
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputButton className="hover:scale-105 active:scale-95 transition-all">
                <PureAttachmentsButton />
              </PromptInputButton>
              {/* YouTube connect button removed from ChatInput UI intentionally; preserved for future reuse */}
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
