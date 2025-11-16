import React, { Dispatch, SetStateAction, memo } from "react";
import { UIMessage } from "ai";
import { MessageEditor } from "./message-editor";

export interface EditingMessageProps {
  message: UIMessage;
  setMode: Dispatch<SetStateAction<"view" | "edit">>;
}

const EditingMessageComponent: React.FC<EditingMessageProps> = ({
  message,
  setMode,
}: EditingMessageProps) => {
  return (
    <div className="flex flex-row gap-2 items-start">
      <div className="size-8" />
      <MessageEditor key={message.id} message={message} setMode={setMode} />
    </div>
  );
};

const EditingMessage = memo(
  EditingMessageComponent,
  (prevProps: EditingMessageProps, nextProps: EditingMessageProps) =>
    prevProps.message.id === nextProps.message.id
);

export default EditingMessage;
