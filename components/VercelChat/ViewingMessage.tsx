import React, { memo } from "react";
import { UIMessage } from "ai";
import { cn } from "@/lib/utils";
import { TextMessagePart } from "./messages";

interface ViewingMessageProps {
  message: UIMessage;
  partText: string;
}

const ViewingMessageComponent: React.FC<ViewingMessageProps> = ({
  message,
  partText,
}) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <div
        data-testid="message-content"
        className={cn("flex flex-col gap-4", {
          "dark:bg-zinc-800 bg-zinc-100 px-4 py-2.5 rounded-3xl rounded-br-lg border":
            message.role === "user",
        })}
      >
        <TextMessagePart text={partText} />
      </div>
    </div>
  );
};

const ViewingMessage = memo(ViewingMessageComponent, (prevProps, nextProps) => {
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.partText === nextProps.partText
  );
});

export default ViewingMessage;
