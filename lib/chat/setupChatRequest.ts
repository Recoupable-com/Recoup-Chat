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
import { handleNanoBananaModel } from "./handleNanoBananaModel";

export async function setupChatRequest(body: ChatRequest): Promise<ChatConfig> {
  const {
    accountId,
    artistId,
    excludeTools,
    email,
    artistInstruction,
    knowledgeBaseText,
    timezone,
  } = body;

  // Handle Fal nano banana model selection
  const nanoBananaConfig = handleNanoBananaModel(body);

  // Use exclude tools from nano banana config if available
  const finalExcludeTools = nanoBananaConfig.excludeTools || excludeTools;
  const tools = filterExcludedTools(getMcpTools(), finalExcludeTools);

  const system = await getSystemPrompt({
    roomId: body.roomId,
    artistId,
    accountId,
    email,
    artistInstruction,
    knowledgeBaseText,
    timezone,
  });

  const config: ChatConfig = {
    model: nanoBananaConfig.resolvedModel || DEFAULT_MODEL,
    system,
    messages: convertToModelMessages(body.messages, {
      tools,
      ignoreIncompleteToolCalls: true,
    }).slice(-MAX_MESSAGES),
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

  return config;
}
