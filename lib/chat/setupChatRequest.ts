import generateUUID from "@/lib/generateUUID";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import attachRichFiles from "@/lib/chat/attachRichFiles";
import getSystemPrompt from "@/lib/prompts/getSystemPrompt";
import { getAccountEmails } from "@/lib/supabase/account_emails/getAccountEmails";
import { MAX_MESSAGES } from "./const";
import { type ChatRequest, type ChatConfig } from "./types";
import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { GOOGLE_MODEL } from "../consts";
import { stepCountIs } from "ai";

export async function setupChatRequest(body: ChatRequest): Promise<ChatConfig> {
  let { email } = body;
  const { accountId, artistId } = body;

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
    stopWhen: stepCountIs(111),
    // prepareStep: ({ steps, ...rest }) => {
    //   // Extract tool calls timeline (history) from steps
    //   const toolCallsContent = steps.flatMap(step =>
    //     step.toolResults?.map(result => ({
    //       type: 'tool-result' as const,
    //       toolCallId: result.toolCallId || '',
    //       toolName: result.toolName,
    //       output: { type: 'json' as const, value: result.output }
    //     })) || []
    //   );

    //   const next = getNextToolByChains(steps, toolCallsContent);
    //   if (next) {
    //     return { ...rest, ...next } as typeof rest & typeof next;
    //   }
    //   return rest;
    // },
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
