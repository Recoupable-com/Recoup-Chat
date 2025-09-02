import telegramClient from "./client";
import { trimMessage } from "./trimMessage";

type SendMessageOptions = { parse_mode?: string };
type TelegramMessage = { message_id: number };

const isEdge = typeof (globalThis as any).EdgeRuntime !== "undefined";

export const sendMessage = async (
  text: string,
  options?: SendMessageOptions
): Promise<TelegramMessage> => {
  if (isEdge) {
    // No-op on Edge runtime
    return { message_id: -1 };
  }

  if (!process.env.TELEGRAM_CHAT_ID) {
    throw new Error("TELEGRAM_CHAT_ID environment variable is required");
  }

  const trimmedText = trimMessage(text);

  return telegramClient.sendMessage(
    process.env.TELEGRAM_CHAT_ID,
    trimmedText,
    options
  );
};
