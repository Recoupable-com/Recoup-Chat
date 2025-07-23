import { ModelMessage, LanguageModel, UIMessage, ToolSet } from "ai";

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
}

export type ResponseMessages = ModelMessage & {
  id: string;
};
