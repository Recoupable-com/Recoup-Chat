import createMemories from "@/lib/supabase/createMemories";
import { validateMessages } from "@/lib/chat/validateMessages";
import getRoom from "@/lib/supabase/getRoom";
import { createRoomWithReport } from "@/lib/supabase/createRoomWithReport";
import { generateChatTitle } from "@/lib/chat/generateChatTitle";
import { sendNewConversationNotification } from "@/lib/telegram/sendNewConversationNotification";
import filterMessageContentForMemories from "@/lib/messages/filterMessageContentForMemories";
import { serializeError } from "@/lib/errors/serializeError";
import { sendErrorNotification } from "@/lib/telegram/errors/sendErrorNotification";
import { getAccountEmails } from "@/lib/supabase/account_emails/getAccountEmails";
import { type ChatRequest } from "./types";
import { AssistantModelMessage, ToolModelMessage, UIMessage } from "ai";
import generateUUID from "../generateUUID";

export async function handleChatCompletion(
  body: ChatRequest,
  responseMessages: UIMessage[]
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

    const room = await getRoom(roomId);

    // Create room and send notification if this is a new conversation
    if (!room) {
      const latestMessageText =
        lastMessage.parts.find((part) => part.type === "text")?.text || "";
      const conversationName = await generateChatTitle(latestMessageText);

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
          firstMessage: latestMessageText,
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

    console.log("SAVE RESPONSE IN MEMORIES", responseMessages);

    // TODO: save assistant memory
    await createMemories({
      id: generateUUID(),
      room_id: roomId,
      content: responseMessages,
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
