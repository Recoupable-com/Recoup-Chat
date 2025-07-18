import {
  CoreAssistantMessage,
  CoreMessage,
  LanguageModel,
  Message,
  ToolSet,
} from "ai";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import createMemories from "@/lib/supabase/createMemories";
import { validateMessages } from "@/lib/chat/validateMessages";
import getSystemPrompt from "@/lib/prompts/getSystemPrompt";
import getRoom from "@/lib/supabase/getRoom";
import { createRoomWithReport } from "@/lib/supabase/createRoomWithReport";
import { generateChatTitle } from "@/lib/chat/generateChatTitle";
import { sendNewConversationNotification } from "@/lib/telegram/sendNewConversationNotification";
import filterMessageContentForMemories from "@/lib/messages/filterMessageContentForMemories";
import { serializeError } from "@/lib/errors/serializeError";
import attachRichFiles from "@/lib/chat/attachRichFiles";
import { sendErrorNotification } from "@/lib/telegram/errors/sendErrorNotification";
import { getAccountEmails } from "@/lib/supabase/account_emails/getAccountEmails";

const MAX_MESSAGES = 55;

export interface ChatRequest {
  messages: Array<Message>;
  roomId: string;
  artistId?: string;
  accountId: string;
  email?: string;
}

export interface ChatSetupResult {
  messagesWithRichFiles: CoreMessage[];
  system: string;
  tools: ToolSet;
  email: string;
}

export interface ChatConfig {
  model: LanguageModel;
  system: string;
  messages: CoreMessage[];
  maxSteps: number;
  experimental_generateMessageId: () => string;
  tools: ToolSet;
}

export async function setupChatRequest(
  body: ChatRequest
): Promise<ChatSetupResult> {
  let { email } = body;
  const { accountId, artistId } = body;

  if (!email && accountId) {
    const emails = await getAccountEmails(accountId);
    if (emails.length > 0 && emails[0].email) {
      email = emails[0].email;
    }
  }

  const tools = await getMcpTools();

  // Attach files like PDFs and images
  const messagesWithRichFiles = await attachRichFiles(body.messages, {
    artistId: artistId as string,
  });

  const system = await getSystemPrompt({
    roomId: body.roomId,
    artistId,
    accountId,
    email,
  });

  return {
    messagesWithRichFiles,
    system,
    tools,
    email: email || "",
  };
}

export function createChatConfig(
  setupResult: ChatSetupResult,
  model: LanguageModel,
  generateMessageId: () => string
): ChatConfig {
  return {
    model,
    system: setupResult.system,
    messages: setupResult.messagesWithRichFiles.slice(-getMaxMessages()),
    maxSteps: 111,
    experimental_generateMessageId: generateMessageId,
    tools: setupResult.tools,
  };
}

export interface ResponseMessages extends CoreAssistantMessage {
  id: string;
}

export async function handleChatCompletion(
  body: ChatRequest,
  responseMessages: ResponseMessages[]
): Promise<void> {
  try {
    const { messages, roomId, accountId, artistId } = body;
    let email = body.email || "";

    if (!email && accountId) {
      const emails = await getAccountEmails(accountId);
      if (emails.length > 0 && emails[0].email) {
        email = emails[0].email;
      }
    }

    const { lastMessage } = validateMessages(messages);
    const [, assistantMessage] = appendResponseMessages({
      messages: [lastMessage],
      responseMessages,
    });

    const room = await getRoom(roomId);
    const conversationName = await generateChatTitle(messages[0].content);

    // Create room and send notification if this is a new conversation
    if (!room) {
      await Promise.all([
        createRoomWithReport({
          account_id: accountId,
          topic: conversationName,
          artist_id: artistId || undefined,
          chat_id: roomId || undefined,
        }),
        sendNewConversationNotification({
          accountId,
          email,
          conversationId: roomId,
          topic: conversationName,
          firstMessage: messages[0].content,
        }),
      ]);
    }

    // Store messages sequentially to maintain correct order
    // First store the user message, then the assistant message
    await createMemories({
      id: lastMessage.id,
      room_id: roomId,
      content: filterMessageContentForMemories(lastMessage),
    });

    await createMemories({
      id: assistantMessage.id,
      room_id: roomId,
      content: filterMessageContentForMemories(assistantMessage),
    });
  } catch (error) {
    sendErrorNotification({
      ...body,
      path: "/api/chat",
      error: serializeError(error),
    });
    console.error("Failed to save chat", error);
  }
}

export function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };
}

export function getMaxMessages() {
  return MAX_MESSAGES;
}

// Helper function to append response messages (imported from ai)
import { appendResponseMessages } from "ai";
