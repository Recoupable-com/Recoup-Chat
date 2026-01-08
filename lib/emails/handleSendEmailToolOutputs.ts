import { UIMessage } from "ai";
import { extractSendEmailResults } from "./extractSendEmailResults";
import { insertMemoryEmail } from "@/lib/supabase/memory_emails/insertMemoryEmail";

export async function handleSendEmailToolOutputs(
  responseMessages: UIMessage[]
): Promise<void> {
  const emailResults = extractSendEmailResults(responseMessages);
  for (const { emailId, messageId } of emailResults) {
    await insertMemoryEmail({
      email_id: emailId,
      memory: messageId,
      message_id: messageId,
    });
  }
}
