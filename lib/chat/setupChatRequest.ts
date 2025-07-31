import generateUUID from "@/lib/generateUUID";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import attachRichFiles from "@/lib/chat/attachRichFiles";
import getSystemPrompt from "@/lib/prompts/getSystemPrompt";
import { getAccountEmails } from "@/lib/supabase/account_emails/getAccountEmails";
import { MAX_MESSAGES } from "./const";
import { type ChatRequest, type ChatConfig } from "./types";
import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { GOOGLE_MODEL } from "../consts";
import { hasToolCall, stepCountIs } from "ai";

export async function setupChatRequest(body: ChatRequest): Promise<ChatConfig> {
  let { email } = body;
  const { accountId, artistId } = body;
  const isCreatingArtist = hasToolCall("create_new_artist");
  console.log("isCreatingArtist", isCreatingArtist);
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
    model: GOOGLE_MODEL,
    system,
    messages: messagesWithRichFiles.slice(-MAX_MESSAGES),
    experimental_generateMessageId: generateUUID,
    tools,
    stopWhen: stepCountIs(11),
    providerOptions: {
      anthropic: {
        thinking: { type: "enabled", budgetTokens: 12000 },
      } satisfies AnthropicProviderOptions,
      google: {
        thinkingConfig: {
          thinkingBudget: 8192,
          includeThoughts: true,
        },
      },
    },
  };
}
