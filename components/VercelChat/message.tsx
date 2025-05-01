import { UIMessage } from "ai";
import ReasoningMessagePart from "./ReasoningMessagePart";
import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { UseChatHelpers } from "@ai-sdk/react";
import ViewingMessage from "./ViewingMessage";
import EditingMessage from "./EditingMessage";
import { ImageSkeleton } from "@/components/ui/ImageSkeleton";
import { ImageResult } from "@/components/ui/ImageResult";

const Message = ({
  message,
  setMessages,
  reload,
}: {
  message: UIMessage;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
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

              if (part.type === "reasoning") {
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

              if (type === "tool-invocation") {
                const { toolInvocation } = part;
                const { toolName, toolCallId, state } = toolInvocation;

                if (toolName === "generate_image") {
                  if (state === "call") {
                    return (
                      <div key={toolCallId} className="skeleton">
                        <ImageSkeleton />
                      </div>
                    );
                  }

                  if (state === "result") {
                    const { result } = toolInvocation;
                    return (
                      <div key={toolCallId}>
                        <ImageResult result={result} />
                      </div>
                    );
                  }
                }

                if (state === "call") {
                  return (
                    <div key={toolCallId}>
                      <div className="text-sm text-gray-500">
                        Using {toolName}...
                      </div>
                    </div>
                  );
                }

                if (state === "result") {
                  const { result } = toolInvocation;
                  return (
                    <div key={toolCallId}>
                      <pre>{JSON.stringify(result, null, 2)}</pre>
                    </div>
                  );
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
