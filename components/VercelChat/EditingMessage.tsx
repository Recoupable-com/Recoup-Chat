import React, { Dispatch, SetStateAction, memo } from "react";
import { UIMessage } from "ai";
import { MessageEditor } from "./message-editor";
import { UseChatHelpers } from "@ai-sdk/react";

export interface EditingMessageProps {
  message: UIMessage;
  setMode: Dispatch<SetStateAction<"view" | "edit">>;
  setMessages: UseChatHelpers<UIMessage>["setMessages"];
  reload: () => void;
}

const EditingMessageComponent: React.FC<EditingMessageProps> = ({
  message,
  setMode,
  setMessages,
  reload,
}: EditingMessageProps) => {
  return (
    <div className="flex flex-row gap-2 items-start">
      <div className="size-8" />
      <MessageEditor
        key={message.id}
        message={message}
        setMode={setMode}
        setMessages={setMessages}
        reload={reload}
      />
    </div>
  );
};

const EditingMessage = memo(EditingMessageComponent, (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id;
});

export default EditingMessage;
