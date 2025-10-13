import { Eval } from "braintrust";
import { callChatFunctions } from "@/lib/evals";
import { QuestionAnswered } from "@/lib/evals/scorers/QuestionAnswered";

/**
 * TikTok Total Views Evaluation
 *
 * This evaluation tests whether the AI system properly answers questions about
 * TikTok total views. The AI should either:
 * 1. Provide the specific number if available through tools/data
 * 2. Use web search to find the answer
 * 3. Calculate from available video data
 *
 * The AI should NOT simply explain why it can't answer without attempting to get the data.
 *
 * Run: npx braintrust eval evals/tiktok-total-views.eval.ts
 */
Eval("TikTok Total Views Evaluation", {
  data: () => [
    {
      input: "how many total views does @iamjuliusblack have on TikTok",
      expected:
        "A specific number of total views (e.g., '150,000 total views')",
      metadata: {
        artist: "Julius Black",
        platform: "tiktok",
        handle: "@iamjuliusblack",
        metric: "total_views",
        expected_tool_usage: true,
        data_type: "social_analytics",
        requires_web_search: true,
        should_answer: true,
        answer_type: "numerical",
      },
    },
  ],

  task: async (input: string): Promise<string> => {
    try {
      const response = await callChatFunctions(input);
      return response;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : "Function call failed"}`;
    }
  },

  scores: [QuestionAnswered],
});
