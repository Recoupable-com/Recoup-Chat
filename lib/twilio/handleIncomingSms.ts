import { ParsedSmsMessage } from "@/types/twilio";
import { generateText, UIMessage } from "ai";
import generateUUID from "@/lib/generateUUID";
import { setupChatRequest } from "@/lib/chat/setupChatRequest";
import { type ChatRequest } from "@/lib/chat/types";

// Hardcoded account ID for SMS users
const SMS_ACCOUNT_ID = "fb678396-a68f-4294-ae50-b8cacf9ce77b";
const SMS_ROOM_ID = "e7d76987-9654-4fa0-a641-e1b4fbd4e91d";

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

    const artistInstruction =
      "keep the response short and concise with text short enough to fit in a single SMS message.";

    const chatRequest: ChatRequest = {
      roomId: SMS_ROOM_ID,
      messages: [userMessage],
      artistInstruction,
      accountId: SMS_ACCOUNT_ID,
    };

    // Setup chat configuration and generate AI response
    const chatConfig = await setupChatRequest(chatRequest);
    const result = await generateText(chatConfig);

    // Return AI-generated response (truncate if too long for SMS)
    const responseText = result.text || "Thanks for your message!";
    return truncateSmsResponse(responseText);
  } catch (error) {
    console.error("Error processing SMS with AI:", error);
    return "Thanks for your message to Recoup! We'll get back to you soon.";
  }
};

/**
 * Truncates response to fit SMS character limits (160 characters for single SMS)
 * @param text - Full response text
 * @returns Truncated text
 */
const truncateSmsResponse = (text: string): string => {
  const MAX_SMS_LENGTH = 160;

  if (text.length <= MAX_SMS_LENGTH) {
    return text;
  }

  // Truncate and add ellipsis
  return text.substring(0, MAX_SMS_LENGTH - 3) + "...";
};
