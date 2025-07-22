import { UIMessage } from "ai";

export function validateMessages(messages: UIMessage[]) {
  if (!messages.length) {
    throw new Error("No messages provided");
  }

  return {
    lastMessage: messages[messages.length - 1],
    validMessages: messages.filter(
      (m) =>
        m.parts.find((part) => part.type === "text")?.text?.length &&
        m.parts.length > 0
    ),
  };
}
