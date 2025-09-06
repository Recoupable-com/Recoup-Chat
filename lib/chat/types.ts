import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import { FalProviderOptions } from "@ai-sdk/fal";
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
  timezone?: string;
  excludeTools?: string[];
  knowledgeFiles?: KnowledgeBaseEntry[];
  artistInstruction?: string;
  knowledgeBaseText?: string;
}

export interface ChatConfig {
  model: string | any;
  system: string;
  messages: ModelMessage[];
  experimental_generateMessageId: () => string;
  tools: ToolSet;
  prepareStep?: PrepareStepFunction;
  providerOptions?: {
    anthropic?: AnthropicProviderOptions;
    google?: GoogleGenerativeAIProviderOptions;
    openai?: OpenAIResponsesProviderOptions;
    fal?: FalProviderOptions;
  };
  stopWhen?:
    | StopCondition<NoInfer<ToolSet>>
    | StopCondition<NoInfer<ToolSet>>[]
    | undefined;
}
