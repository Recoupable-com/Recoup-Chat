/**
 * Parsed SMS message data
 */
export interface ParsedSmsMessage {
  from: string;
  to: string;
  body: string;
  messageSid: string;
  accountSid: string;
  mediaCount: number;
}
