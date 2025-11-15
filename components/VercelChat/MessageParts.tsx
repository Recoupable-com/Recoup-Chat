import { ChatStatus, ToolUIPart, UIMessage, isToolUIPart } from "ai";
import { Dispatch, SetStateAction } from "react";
import { UseChatHelpers } from "@ai-sdk/react";
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
import { type RoutingStatusData } from "@/lib/agents/routingAgent";

interface MessagePartsProps {
  message: UIMessage;
  status: ChatStatus;
  mode: "view" | "edit";
  setMode: Dispatch<SetStateAction<"view" | "edit">>;
  setMessages: UseChatHelpers<UIMessage>["setMessages"];
  reload: () => void;
}

export function MessageParts({
  message,
  status,
  mode,
  setMode,
  setMessages,
  reload,
}: MessagePartsProps) {
  return (
    <div className={cn("flex flex-col gap-4 w-full group")}>
      {message.parts?.map((part, partIndex) => {
        const { type } = part;
        const key = `message-${message.id}-part-${partIndex}`;

        if (type === ROUTING_STATUS_DATA_TYPE) {
          const routingData = part.data as RoutingStatusData;
          return (
            <RoutingStatus
              key={key}
              status={routingData.status}
              message={routingData.message}
              agent={routingData.agent}
            />
          );
        }

        if (type === "reasoning") {
          return (
            <EnhancedReasoning
              key={key}
              className="w-full"
              content={part.text}
              isStreaming={
                status === "streaming" && partIndex === message.parts.length - 1
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
                <ViewingMessage message={message} partText={part?.text || ""} />
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
  );
}
