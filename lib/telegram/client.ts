// Edge-safe Telegram client wrapper that avoids importing Node-only modules on Edge

type TelegramMessage = { message_id: number };

type TelegramClient = {
  sendMessage: (
    chatId: string,
    text: string,
    options?: { parse_mode?: string }
  ) => Promise<TelegramMessage>;
};

const isEdge = typeof (globalThis as any).EdgeRuntime !== "undefined";

let initializedClient: any | null = null;

async function getNodeClient(): Promise<any> {
  if (initializedClient) return initializedClient;
  const { default: TelegramBot } = await import("node-telegram-bot-api");
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");
  }
  const client = new TelegramBot(token, { polling: false });
  client.on("error", (error: Error) => {
    console.error("Telegram client error:", error);
  });
  initializedClient = client;
  return client;
}

const telegramClient: TelegramClient = isEdge
  ? {
      async sendMessage() {
        // No-op on Edge runtime
        return { message_id: -1 };
      },
    }
  : {
      async sendMessage(chatId, text, options) {
        const client = await getNodeClient();
        return client.sendMessage(chatId, text, options);
      },
    };

export default telegramClient;
