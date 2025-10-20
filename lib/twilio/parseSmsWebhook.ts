import { ParsedSmsMessage } from "@/types/twilio";

/**
 * Parses Twilio SMS webhook FormData into a structured object
 * @param formData - FormData from Twilio webhook request
 * @returns Parsed SMS message data
 */
export const parseSmsWebhook = (formData: FormData): ParsedSmsMessage => {
  return {
    from: formData.get("From") as string,
    to: formData.get("To") as string,
    body: formData.get("Body") as string,
    messageSid: formData.get("MessageSid") as string,
    accountSid: formData.get("AccountSid") as string,
    mediaCount: parseInt(formData.get("NumMedia") as string) || 0,
  };
};
