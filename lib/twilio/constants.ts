/**
 * Twilio SMS constants and configuration
 */

// Hardcoded account and room IDs for SMS users
export const SMS_ACCOUNT_ID = "fb678396-a68f-4294-ae50-b8cacf9ce77b";
export const SMS_ROOM_ID = "e7d76987-9654-4fa0-a641-e1b4fbd4e91d";

// Fallback message when AI processing fails
export const SMS_FALLBACK_MESSAGE =
  "Thanks for your message to Recoup! We'll get back to you soon.";

// System instruction for SMS responses
export const SMS_ARTIST_INSTRUCTION =
  "keep the response short and concise with text short enough to fit in a single SMS message.";
