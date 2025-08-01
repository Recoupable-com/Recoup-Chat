import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import {
  type ModelMessage,
  type LanguageModel,
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
}

export interface ChatConfig {
  model: LanguageModel;
  system: string;
  messages: ModelMessage[];
  experimental_generateMessageId: () => string;
  tools: ToolSet;
  prepareStep?: PrepareStepFunction;
  providerOptions?: {
    anthropic?: AnthropicProviderOptions;
    google?: GoogleGenerativeAIProviderOptions;
  };
  stopWhen?:
    | StopCondition<NoInfer<ToolSet>>
    | StopCondition<NoInfer<ToolSet>>[]
    | undefined;
}
