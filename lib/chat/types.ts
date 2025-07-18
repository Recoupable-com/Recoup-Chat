import {
  CoreAssistantMessage,
  CoreMessage,
  LanguageModel,
  Message,
  ToolSet,
} from "ai";

export interface ChatRequest {
  messages: Array<Message>;
  roomId: string;
  artistId?: string;
  accountId: string;
  email?: string;
}

export interface ChatConfig {
  model: LanguageModel;
  system: string;
  messages: CoreMessage[];
  maxSteps: number;
  experimental_generateMessageId: () => string;
  tools: ToolSet;
}

export interface ResponseMessages extends CoreAssistantMessage {
  id: string;
}
