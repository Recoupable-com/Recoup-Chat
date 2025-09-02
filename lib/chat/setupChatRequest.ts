import generateUUID from "@/lib/generateUUID";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import attachRichFiles from "@/lib/chat/attachRichFiles";
import getSystemPrompt from "@/lib/prompts/getSystemPrompt";
import { MAX_MESSAGES } from "./const";
import { type ChatRequest, type ChatConfig } from "./types";
import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { DEFAULT_MODEL } from "../consts";
import { stepCountIs } from "ai";
import getPrepareStepResult from "./toolChains/getPrepareStepResult";
import { filterExcludedTools } from "./filterExcludedTools";

export async function setupChatRequest(body: ChatRequest): Promise<ChatConfig> {
  const { accountId, artistId, model, excludeTools, email, knowledgeFiles } = body;
  const tools = filterExcludedTools(getMcpTools(), excludeTools);

  const messagesWithRichFiles = attachRichFiles(body.messages, {
    artistId: artistId as string,
    knowledgeFiles,
  });

  const system = await getSystemPrompt({
    roomId: body.roomId,
    artistId,
    accountId,
    email,
  });

  return {
    model: model || DEFAULT_MODEL,
    system,
    messages: messagesWithRichFiles.slice(-MAX_MESSAGES),
    experimental_generateMessageId: generateUUID,
    tools,
    stopWhen: stepCountIs(111),
    prepareStep: (options) => {
      const next = getPrepareStepResult(options);
      if (next) {
        return { ...options, ...next };
      }
      return options;
    },
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
      openai: {
        reasoningEffort: "medium",
        reasoningSummary: "detailed",
      },
    },
  };
}
