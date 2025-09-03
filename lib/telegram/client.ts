// Edge-safe Telegram client wrapper that avoids importing Node-only modules on Edge

type TelegramMessage = { message_id: number };

type TelegramClient = {
  sendMessage: (
    chatId: string,
    text: string,
    options?: { parse_mode?: string }
  ) => Promise<TelegramMessage>;
};

const isEdge =
  typeof (globalThis as { EdgeRuntime?: unknown }).EdgeRuntime !== "undefined";

// Use unknown to avoid any and cast only at the call site where needed
let botPromise: Promise<unknown> | null = null;

async function getBot(): Promise<unknown> {
  if (botPromise) return botPromise;
  botPromise = (async () => {
    const { default: TelegramBot } = await import("node-telegram-bot-api");
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");
    }
    const bot = new TelegramBot(token, { polling: false });
    bot.on("error", (error: Error) => {
      console.error("Telegram client error:", error);
    });
    return bot;
  })();
  return botPromise;
}

const telegramClient: TelegramClient = isEdge
  ? {
      async sendMessage() {
        // No-op in Edge runtime
        return { message_id: -1 };
      },
    }
  : {
      async sendMessage(chatId, text, options) {
        const bot = (await getBot()) as {
          sendMessage: (
            chatId: string,
            text: string,
            options?: { parse_mode?: string }
          ) => Promise<TelegramMessage>;
        };
        return bot.sendMessage(chatId, text, options);
      },
    };

export default telegramClient;
