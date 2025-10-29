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
  console.log("🔧 setupChatRequest - Model config:", {
    requestedModel: body.model,
    resolvedModel: nanoBananaConfig.resolvedModel,
    excludeTools: nanoBananaConfig.excludeTools,
  });

  // Use exclude tools from nano banana config if available
  const finalExcludeTools = nanoBananaConfig.excludeTools || excludeTools;
  const allTools = getMcpTools();
  const tools = filterExcludedTools(allTools, finalExcludeTools);
  
  console.log("🔧 setupChatRequest - Tools:", {
    totalTools: Object.keys(allTools).length,
    filteredTools: Object.keys(tools).length,
    hasNanoBananaEdit: "nano_banana_edit" in tools,
    hasNanoBananaGenerate: "nano_banana_generate" in tools,
  });

  // Extract image URLs from messages to add to system prompt
  const imageUrls: string[] = [];
  for (const message of body.messages) {
    if (message.parts) {
      for (const part of message.parts) {
        if (part.type === 'file' && part.mediaType?.startsWith('image/')) {
          imageUrls.push(part.url);
        }
      }
    }
  }

  let system = await getSystemPrompt({
    roomId: body.roomId,
    artistId,
    accountId,
    email,
    artistInstruction,
    knowledgeBaseText,
    timezone,
  });

  // If there are image attachments, add their URLs to system prompt for tool extraction
  if (imageUrls.length > 0) {
    system += `\n\n**ATTACHED IMAGE URLS (for nano_banana_edit imageUrl parameter):**\n${imageUrls.map((url, i) => `- Image ${i}: ${url}`).join('\n')}`;
  }

  const convertedMessages = convertToModelMessages(body.messages, {
    tools,
    ignoreIncompleteToolCalls: true,
  }).slice(-MAX_MESSAGES);

  const config: ChatConfig = {
    model: nanoBananaConfig.resolvedModel || DEFAULT_MODEL,
    system,
    messages: convertedMessages,
    experimental_generateMessageId: generateUUID,
    tools,
    stopWhen: stepCountIs(111),
    // Pass image URLs through as-is so GPT can extract them for tool parameters
    experimental_download: async (files) => {
      return files.map(() => null); // null = pass URL through to model instead of downloading
    },
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
