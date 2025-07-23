"use client";

import { useEffect, useMemo, useRef, memo } from "react";
import { SpinnerIcon } from "./icons";
import { UIMessage } from "ai";
import { UseChatHelpers } from "@ai-sdk/react";
import ChatMarkdown from "../Chat/ChatMarkdown";
import Message from "./message";

interface TextMessagePartProps {
  text: string;
}

export function TextMessagePart({ text }: TextMessagePartProps) {
  return (
    <div className="flex flex-col gap-4">
      <ChatMarkdown>{text}</ChatMarkdown>
    </div>
  );
}

interface MessagesProps {
  messages: Array<UIMessage>;
  status: "submitted" | "streaming" | "error" | "idle";
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
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesLength = useMemo(() => messages.length, [messages]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messagesLength]);

  return (
    <div
      className="flex flex-col gap-8 overflow-y-scroll items-center w-full pt-6 pb-16 md:pt-8 md:pb-20"
      ref={messagesRef}
    >
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
        <div className="text-zinc-500 w-full flex items-center gap-2">
          Hmm...
          <div className="inline-block animate-spin">
            <SpinnerIcon />
          </div>
        </div>
      )}
    </div>
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
