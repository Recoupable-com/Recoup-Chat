import generateUUID from "@/lib/generateUUID";
import getSystemPrompt from "@/lib/prompts/getSystemPrompt";
import { MAX_MESSAGES } from "./const";
import { type ChatRequest, type ChatConfig } from "./types";
import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { DEFAULT_MODEL } from "../consts";
import { convertToModelMessages, stepCountIs } from "ai";
import getPrepareStepResult from "./toolChains/getPrepareStepResult";
import { handleNanoBananaModel } from "./handleNanoBananaModel";
import { extractImageUrlsFromMessages } from "./extractImageUrlsFromMessages";
import { buildSystemPromptWithImages } from "./buildSystemPromptWithImages";
import { setupToolsForRequest } from "./setupToolsForRequest";
import { getRoutingDecision } from "@/lib/agents/routingAgent";
import { getGoogleSheetsAgent } from "../agents/googleSheetsAgent/googleSheetsAgent";

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

  const routingDecision = await getRoutingDecision(body);
  console.log("routingDecision", routingDecision);

  // Configure model and tools based on nano banana selection
  const nanoBananaConfig = handleNanoBananaModel(body);

  const finalExcludeTools = nanoBananaConfig.excludeTools || excludeTools;
  const tools = setupToolsForRequest(finalExcludeTools);

  // Build system prompt with image URLs if needed
  const imageUrls = extractImageUrlsFromMessages(body.messages);
  const baseSystemPrompt = await getSystemPrompt({
    roomId: body.roomId,
    artistId,
    accountId,
    email,
    artistInstruction,
    knowledgeBaseText,
    timezone,
  });
  const system = buildSystemPromptWithImages(baseSystemPrompt, imageUrls);

  const convertedMessages = convertToModelMessages(body.messages, {
    tools,
    ignoreIncompleteToolCalls: true,
  }).slice(-MAX_MESSAGES);

  const isGoogleSheetsAgent = routingDecision.agent === "googleSheetsAgent";

  const config: ChatConfig = {
    model: nanoBananaConfig.resolvedModel || DEFAULT_MODEL,
    system,
    messages: convertedMessages,
    experimental_generateMessageId: generateUUID,
    tools,
    stopWhen: stepCountIs(111),
    // Only override download behavior for nano banana image editing
    // For all other models/use cases (PDFs, audio, etc.), default download behavior is used
    ...(nanoBananaConfig.shouldPassImageUrlsThrough && {
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

  if (isGoogleSheetsAgent) {
    const googleSheetsAgent = await getGoogleSheetsAgent(accountId);
    config.tools = googleSheetsAgent.tools;
    config.agent = googleSheetsAgent;
  }

  return config;
}
