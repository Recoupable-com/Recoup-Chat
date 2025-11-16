import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import { VercelToolCollection } from "@composio/vercel";
import {
  type ModelMessage,
  type UIMessage,
  type ToolSet,
  type StopCondition,
  type PrepareStepFunction,
  type ToolLoopAgent,
} from "ai";

export interface ChatRequest {
  messages: Array<UIMessage>;
  roomId: string;
  artistId?: string;
  accountId: string;
  email?: string;
  model?: string;
  timezone?: string;
  excludeTools?: string[];
  artistInstruction?: string;
  knowledgeBaseText?: string;
}

export interface RoutingDecision {
  model: string;
  instructions: string;
  agent: ToolLoopAgent<never, VercelToolCollection, never>;
  stopWhen?:
    | StopCondition<NoInfer<ToolSet>>
    | StopCondition<NoInfer<ToolSet>>[]
    | undefined;
}

export interface ChatConfig extends RoutingDecision {
  system: string;
  messages: ModelMessage[];
  experimental_generateMessageId: () => string;
  experimental_download?: (
    files: Array<{ url: URL; isUrlSupportedByModel: boolean }>
  ) => Promise<
    Array<{ data: Uint8Array; mediaType: string | undefined } | null>
  >;
  tools: ToolSet;
  prepareStep?: PrepareStepFunction;
  providerOptions?: {
    anthropic?: AnthropicProviderOptions;
    google?: GoogleGenerativeAIProviderOptions;
    openai?: OpenAIResponsesProviderOptions;
  };
}
