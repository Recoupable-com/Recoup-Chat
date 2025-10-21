import { ParsedSmsMessage } from "@/types/twilio";
import { handleIncomingSms } from "./handleIncomingSms";
import { sendSmsMessage } from "./sendSmsMessage";
import { SMS_FALLBACK_MESSAGE } from "./constants";

/**
 * Processes incoming SMS with AI and sends reply via Twilio API
 * This runs asynchronously after the webhook response
 *
 * @param smsData - Parsed SMS message data
 */
export const processAndReply = async (
  smsData: ParsedSmsMessage
): Promise<void> => {
  try {
    // Generate AI response (can take 10-30+ seconds)
    const responseMessage = await handleIncomingSms(smsData);

    // Send response via Twilio REST API
    await sendSmsMessage(smsData.from, responseMessage);
  } catch (error) {
    console.error("Error in processAndReply:", error);

    // Send fallback message on error
    await sendSmsMessage(smsData.from, SMS_FALLBACK_MESSAGE);
  }
};
