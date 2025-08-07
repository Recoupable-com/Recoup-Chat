// Returns available Large Language Models (LLMs) supported by the application.
// This utility lives in the `@ai` namespace to group AI-related helpers.

export interface LlmModel {
  id: string;
  name: string;
}

const MODELS: LlmModel[] = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "openai/gpt-oss-120b", name: "OpenAI GPT-OSS 120B" },
  { id: "xai/grok-3-mini", name: "XAI Grok 3 Mini" },
  { id: "alibaba/qwen-3-235b", name: "Alibaba Qwen 3 235B" },
];

/**
 * Returns the list of available LLMs that a user can pick from.
 */
export const getAvailableModels = (): LlmModel[] => MODELS;
