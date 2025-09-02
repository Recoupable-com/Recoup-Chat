import type { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import type { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import type { OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import {
  type ModelMessage,
  type UIMessage,
  type ToolSet,
  type StopCondition,
  type PrepareStepFunction,
} from "ai";
import type { KnowledgeBaseEntry } from "@/lib/supabase/getArtistKnowledge";

export interface ChatRequest {
  messages: Array<UIMessage>;
  roomId: string;
  artistId?: string;
  accountId: string;
  email?: string;
  model?: string;
  excludeTools?: string[];
  knowledgeFiles?: KnowledgeBaseEntry[];
  artistInstruction?: string;
  knowledgeBaseText?: string;
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
