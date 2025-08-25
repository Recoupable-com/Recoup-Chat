import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import {
  type ModelMessage,
  type UIMessage,
  type ToolSet,
  type StopCondition,
  type PrepareStepFunction,
} from "ai";

export interface ChatRequest {
  messages: Array<UIMessage>;
  roomId: string;
  artistId?: string;
  accountId: string;
  email?: string;
  model?: string;
  excludeTools?: string[];
}

export interface ChatConfig {
  model: string;
  system: string;
  messages: ModelMessage[];
  experimental_generateMessageId: () => string;
  tools: ToolSet;
  prepareStep?: PrepareStepFunction;
  providerOptions?: {
    anthropic?: AnthropicProviderOptions;
    google?: GoogleGenerativeAIProviderOptions;
    openai?: OpenAIResponsesProviderOptions;
  };
  stopWhen?:
    | StopCondition<NoInfer<ToolSet>>
    | StopCondition<NoInfer<ToolSet>>[]
    | undefined;
}
