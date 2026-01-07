import { UIMessage } from "ai";

interface SendEmailResult {
  emailId: string;
  messageId: string;
}

/**
 * Extracts send_email tool results from response messages.
 * Returns an array of email IDs paired with the message ID containing the tool call.
 *
 * @param responseMessages - The assistant messages from the chat response
 * @returns Array of send email results with emailId and messageId
 */
export function extractSendEmailResults(
  responseMessages: UIMessage[]
): SendEmailResult[] {
  const results: SendEmailResult[] = [];

  for (const message of responseMessages) {
    for (const part of message.parts) {
      // Check if this is a send_email tool part with output available
      if (
        "type" in part &&
        typeof part.type === "string" &&
        part.type === "tool-send_email" &&
        "state" in part &&
        part.state === "output-available" &&
        "output" in part &&
        part.output
      ) {
        // The MCP tool returns { success: true, data: { id: "email-id" }, message: "..." }
        const output = part.output as {
          success?: boolean;
          data?: { id?: string };
        };

        if (output.data?.id) {
          results.push({
            emailId: output.data.id,
            messageId: message.id,
          });
        }
      }
    }
  }

  return results;
}
