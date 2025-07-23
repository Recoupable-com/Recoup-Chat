import { ChatStatus, ToolUIPart, UIMessage } from "ai";
import ReasoningMessagePart from "./ReasoningMessagePart";
import { useState } from "react";
import { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ViewingMessage from "./ViewingMessage";
import EditingMessage from "./EditingMessage";
import {
  getToolCallComponent,
  getToolResultComponent,
  ToolResult,
} from "./ToolComponents";
import MessageFileViewer from "./message-file-viewer";

const Message = ({
  message,
  setMessages,
  reload,
  status,
}: {
  message: UIMessage;
  setMessages: UseChatHelpers<UIMessage>["setMessages"];
  reload: () => void;
  status: ChatStatus;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          key={message.id}
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          <div className={cn("flex flex-col gap-4 w-full")}>
            {message.parts?.map((part, partIndex) => {
              const { type } = part;
              const key = `message-${message.id}-part-${partIndex}`;

              if (type === "reasoning") {
                return (
                  <ReasoningMessagePart
                    key={key}
                    part={part}
                    isReasoning={
                      status === "streaming" &&
                      partIndex === message.parts.length - 1
                    }
                  />
                );
              }

              if (type === "file") {
                return <MessageFileViewer key={key} part={part} />;
              }

              if (type === "text") {
                if (mode === "view") {
                  return (
                    <ViewingMessage
                      key={key}
                      message={message}
                      partText={part.text}
                      setMode={setMode}
                    />
                  );
                }

                if (mode === "edit") {
                  return (
                    <EditingMessage
                      key={key}
                      message={message}
                      setMode={setMode}
                      setMessages={setMessages}
                      reload={reload}
                    />
                  );
                }
              }

              if (type.includes("tool")) {
                const toolName = type.split("-")[1];
                const { toolCallId, state, output } = part as ToolUIPart;

                if (state !== "output-available") {
                  return getToolCallComponent({ toolName });
                } else {
                  return getToolResultComponent({
                    toolName,
                    toolCallId,
                    result: output as ToolResult,
                  });
                }
              }
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Message;
