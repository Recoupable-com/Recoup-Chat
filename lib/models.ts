import { anthropic } from "@ai-sdk/anthropic";
import { xai } from "@ai-sdk/xai";

import {
  customProvider,
  wrapLanguageModel,
  defaultSettingsMiddleware,
} from "ai";
import { ANTHROPIC_MODEL, GEMINI_MODEL } from "./consts";
import { google, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

// custom provider with different model settings:
export const myProvider = customProvider({
  languageModels: {
    "sonnet-3.7": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerMetadata: {
            anthropic: {
              thinking: { type: "enabled", budgetTokens: 5000 },
            },
          },
        },
      }),
      model: anthropic(ANTHROPIC_MODEL),
    }),
    "grok-3-mini": xai("grok-3-mini"),
    "gemini-2.5-flash": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerMetadata: {
            google: {
              thinkingConfig: {
                thinkingBudget: 5000,
              },
            } satisfies GoogleGenerativeAIProviderOptions,
          },
        },
      }),
      model: google(GEMINI_MODEL),
    }),
    o4: wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerMetadata: {
            openai: {
              reasoningEffort: "medium",
            },
          },
        },
      }),
      model: openai("o4-mini"),
    }),
  },
  fallbackProvider: xai,
});

export type modelID = Parameters<(typeof myProvider)["languageModel"]>["0"];

export const models: Record<modelID, string> = {
  "sonnet-3.7": "Claude Sonnet 3.7",
  "grok-3-mini": "Grok 3 Mini",
  "gemini-2.5-flash": "Gemini 2.5 Flash",
  o4: "OpenAI o4",
};
