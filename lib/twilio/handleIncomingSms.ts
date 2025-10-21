import { ParsedSmsMessage } from "@/types/twilio";
import { generateText, UIMessage } from "ai";
import generateUUID from "@/lib/generateUUID";
import { setupChatRequest } from "@/lib/chat/setupChatRequest";
import { type ChatRequest } from "@/lib/chat/types";
import {
  SMS_ACCOUNT_ID,
  SMS_ROOM_ID,
  SMS_ARTIST_INSTRUCTION,
  SMS_FALLBACK_MESSAGE,
} from "./constants";

/**
 * Processes incoming SMS message and generates AI response
 * @param smsData - Parsed SMS message data
 * @returns Response message to send back
 */
export const handleIncomingSms = async (
  smsData: ParsedSmsMessage
): Promise<string> => {
  const { from, body } = smsData;

  // Log incoming message
  console.log(`SMS from ${from}: ${body}`);

  try {
    // Create user message in UIMessage format
    const userMessage: UIMessage = {
      id: generateUUID(),
      role: "user",
      parts: [
        {
          type: "text",
          text: body,
        },
      ],
    };

    const chatRequest: ChatRequest = {
      roomId: SMS_ROOM_ID,
      messages: [userMessage],
      artistInstruction: SMS_ARTIST_INSTRUCTION,
      accountId: SMS_ACCOUNT_ID,
    };

    // Setup chat configuration and generate AI response
    const chatConfig = await setupChatRequest(chatRequest);
    const result = await generateText(chatConfig);

    // Return AI-generated response
    return result.text || SMS_FALLBACK_MESSAGE;
  } catch (error) {
    console.error("Error processing SMS with AI:", error);
    return SMS_FALLBACK_MESSAGE;
  }
};
