import generateUUID from "@/lib/generateUUID";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import getSystemPrompt from "@/lib/prompts/getSystemPrompt";
import { MAX_MESSAGES } from "./const";
import { type ChatRequest, type ChatConfig } from "./types";
import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { DEFAULT_MODEL } from "../consts";
import { convertToModelMessages, stepCountIs } from "ai";
import getPrepareStepResult from "./toolChains/getPrepareStepResult";
import { filterExcludedTools } from "./filterExcludedTools";

export async function setupChatRequest(body: ChatRequest): Promise<ChatConfig> {
  const { accountId, artistId, model, excludeTools, email, artistInstruction, knowledgeBaseText, timezone } = body;
  const tools = filterExcludedTools(getMcpTools(), excludeTools);

  const system = getSystemPrompt({
    roomId: body.roomId,
    artistId,
    accountId,
    email,
    artistInstruction,
    knowledgeBaseText,
    timezone,
  });

  return {
    model: model || DEFAULT_MODEL,
    system,
    messages: convertToModelMessages(body.messages.slice(-MAX_MESSAGES)),
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
