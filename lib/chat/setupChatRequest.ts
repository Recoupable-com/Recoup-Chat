import generateUUID from "@/lib/generateUUID";
import { MAX_MESSAGES } from "./const";
import { type ChatConfig } from "./types";
import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { convertToModelMessages } from "ai";
import getPrepareStepResult from "./toolChains/getPrepareStepResult";
import { getGeneralAgent } from "../agents/generalAgent";
import { ChatRequestBody } from "./validateChatRequest";

export async function setupChatRequest(
  body: ChatRequestBody
): Promise<ChatConfig> {
  const decision = await getGeneralAgent(body);

  const system = decision.instructions;
  const tools = decision.agent.tools;

  const shouldPassImageUrlsThrough =
    decision.model === "fal-ai/nano-banana/edit";

  const convertedMessages = convertToModelMessages(body.messages, {
    tools,
    ignoreIncompleteToolCalls: true,
  }).slice(-MAX_MESSAGES);

  const config: ChatConfig = {
    ...decision,
    system,
    messages: convertedMessages,
    experimental_generateMessageId: generateUUID,
    tools,
    // Only override download behavior for nano banana image editing
    // For all other models/use cases (PDFs, audio, etc.), default download behavior is used
    ...(shouldPassImageUrlsThrough && {
      experimental_download: async (files) => {
        return Promise.all(
          files.map(async (file) => {
            // Only pass through URLs when model supports them
            if (file.isUrlSupportedByModel) {
              return null; // Pass URL through
            }
            // Download file when model doesn't support URL
            const response = await fetch(file.url.href);
            const data = new Uint8Array(await response.arrayBuffer());
            const mediaType = response.headers.get("content-type") || undefined;
            return { data, mediaType };
          })
        );
      },
    }),
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
