import { UIMessage } from "ai";

/**
 * Extracts the text content from the last message in the messages array.
 * Filters text parts, joins them, and returns lowercase text.
 */
export function getLastMessageText(messages: UIMessage[]): string {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) {
    return "";
  }

  return (
    lastMessage.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ") || ""
  ).toLowerCase();
}
