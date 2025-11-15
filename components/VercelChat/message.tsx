import { ChatStatus, ToolUIPart, UIMessage, isToolUIPart } from "ai";
import { useState } from "react";
import { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ViewingMessage from "./ViewingMessage";
import EditingMessage from "./EditingMessage";
import { getToolCallComponent, getToolResultComponent } from "./ToolComponents";
import MessageFileViewer from "./message-file-viewer";
import { EnhancedReasoning } from "@/components/reasoning/EnhancedReasoning";
import { Actions, Action } from "@/components/actions";
import { RefreshCcwIcon, Pencil } from "lucide-react";
import CopyAction from "./CopyAction";
import { RoutingStatus } from "./RoutingStatus";
import { ROUTING_STATUS_DATA_TYPE } from "@/lib/consts";

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
          <div className={cn("flex flex-col gap-4 w-full group")}>
            {message.parts?.map((part, partIndex) => {
              const { type } = part;
              const key = `message-${message.id}-part-${partIndex}`;

              // Render routing status data parts
              if (type === ROUTING_STATUS_DATA_TYPE) {
                const routingData = (
                  part as {
                    data?: { status: string; message: string; agent?: string };
                  }
                ).data;
                if (routingData) {
                  return (
                    <RoutingStatus
                      key={key}
                      status={routingData.status as "analyzing" | "complete"}
                      message={routingData.message}
                      agent={routingData.agent}
                    />
                  );
                }
                return null;
              }

              if (type === "reasoning") {
                return (
                  <EnhancedReasoning
                    key={key}
                    className="w-full"
                    content={part.text}
                    isStreaming={
                      status === "streaming" &&
                      partIndex === message.parts.length - 1
                    }
                    defaultOpen={true}
                  />
                );
              }

              if (type === "file") {
                return <MessageFileViewer key={key} part={part} />;
              }

              if (type === "text") {
                const isLastMessage =
                  message.role === "assistant" &&
                  status !== "streaming" &&
                  partIndex === message.parts.length - 1;

                if (mode === "view") {
                  return (
                    <div key={key}>
                      <ViewingMessage
                        message={message}
                        partText={part?.text || ""}
                      />
                      <Actions
                        className={cn(
                          "mt-0.5 gap-0.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity",
                          {
                            "justify-start": message.role === "assistant",
                            "justify-end": message.role === "user",
                          }
                        )}
                      >
                        {message.role === "user" && (
                          <Action
                            onClick={() => setMode("edit")}
                            label="Edit"
                            tooltip="Edit message"
                          >
                            <Pencil className="!w-3 !h-3" />
                          </Action>
                        )}
                        {isLastMessage && (
                          <Action
                            onClick={() => reload()}
                            label="Retry"
                            tooltip="Regenerate this response"
                          >
                            <RefreshCcwIcon className="!w-3 !h-3" />
                          </Action>
                        )}
                        <CopyAction text={part?.text || ""} />
                      </Actions>
                    </div>
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

              if (isToolUIPart(part)) {
                const { state } = part as ToolUIPart;
                if (state !== "output-available") {
                  return getToolCallComponent(part as ToolUIPart);
                } else {
                  return getToolResultComponent(part as ToolUIPart);
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
