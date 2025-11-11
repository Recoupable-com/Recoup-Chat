"use client";

import { memo } from "react";
import { SpinnerIcon } from "./icons";
import { ChatStatus, UIMessage } from "ai";
import { UseChatHelpers } from "@ai-sdk-tools/store";
import { Response } from "@/components/ai-elements/response";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import Message from "./message";
import { cleanFileMentions } from "@/lib/chat/cleanFileMentions";

interface TextMessagePartProps {
  text: string;
}

export function TextMessagePart({ text }: TextMessagePartProps) {
  // Clean file mention markup to prevent [blocked] display
  const cleanedText = cleanFileMentions(text);

  return (
    <div className="flex flex-col gap-4">
      <Response>{cleanedText}</Response>
    </div>
  );
}

interface MessagesProps {
  messages: Array<UIMessage>;
  status: ChatStatus;
  setMessages: UseChatHelpers<UIMessage>["setMessages"];
  reload: () => void;
  children?: React.ReactNode;
}

const MessagesComponent = ({
  messages,
  status,
  setMessages,
  reload,
  children,
}: MessagesProps) => {
  // Conversation component handles scrolling automatically
  // No need for manual scroll logic

  return (
    <Conversation className="flex-1 w-full">
      <ConversationContent className="flex flex-col gap-8 items-center w-full pt-6 pb-16 md:pt-8 md:pb-20">
        {children || null}
        {messages.map((message) => (
          <Message
            status={status}
            key={message.id}
            message={message}
            setMessages={setMessages}
            reload={reload}
          />
        ))}

        {(status === "submitted" || status === "streaming") && (
          <div className="text-zinc-500 dark:text-zinc-400 w-full max-w-3xl mx-auto flex items-center gap-2">
            <div className="inline-block animate-spin">
              <SpinnerIcon />
            </div>
          </div>
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};

export const Messages = memo(
  MessagesComponent,
  (prevProps: MessagesProps, nextProps: MessagesProps) => {
    return (
      prevProps.status === nextProps.status &&
      prevProps.messages === nextProps.messages &&
      prevProps.children === nextProps.children
    );
  }
);
