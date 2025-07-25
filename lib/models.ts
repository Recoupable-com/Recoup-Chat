import { anthropic } from "@ai-sdk/anthropic";
import { xai } from "@ai-sdk/xai";
import { customProvider } from "ai";
import { ANTHROPIC_MODEL } from "./consts";

// custom provider with different model settings:
export const myProvider = customProvider({
  languageModels: {
    "sonnet-3.7": anthropic(ANTHROPIC_MODEL),
    "grok-3-mini": xai("grok-3-mini"),
  },
  fallbackProvider: xai,
});

export type modelID = Parameters<(typeof myProvider)["languageModel"]>["0"];

export const models: Record<modelID, string> = {
  "sonnet-3.7": "Claude Sonnet 3.7",
  "grok-3-mini": "Grok 3 Mini",
};
