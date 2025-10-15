import { Eval } from "braintrust";
import { Factuality, AnswerCorrectness } from "autoevals";
import {
  callChatFunctionsWithResult,
  extractTextFromResult,
} from "@/lib/evals";
import getCatalogSongsCountData from "@/lib/evals/getCatalogSongsCountData";

/**
 * Catalog Songs Count Evaluation
 *
 * This evaluation tests whether your AI system properly uses tool calls
 * to fetch catalog data and return accurate song counts instead of defaulting
 * to "I don't have access" responses.
 *
 * Run: npx braintrust eval evals/catalog-songs-count.eval.ts
 */
Eval("Catalog Songs Count Evaluation", {
  data: getCatalogSongsCountData,
  task: async (input: string): Promise<string> => {
    try {
      const response = await callChatFunctionsWithResult(input);
      const output = extractTextFromResult(response);
      return output;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : "Function call failed"}`;
    }
  },

  scores: [AnswerCorrectness, Factuality],
});
