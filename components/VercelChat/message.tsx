import { ChatStatus, UIMessage } from "ai";
import { useState } from "react";
import { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageParts } from "./MessageParts";

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
          <MessageParts
            message={message}
            status={status}
            mode={mode}
            setMode={setMode}
            setMessages={setMessages}
            reload={reload}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Message;
