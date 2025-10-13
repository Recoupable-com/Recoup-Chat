import { Eval } from "braintrust";
import { callChatFunctions } from "@/lib/evals";
import { QuestionAnswered } from "@/lib/evals/scorers/QuestionAnswered";

/**
 * TikTok Analytics Questions Evaluation
 *
 * This evaluation tests whether the AI system properly answers questions about
 * TikTok analytics and performance data. The AI should:
 * 1. Provide specific answers/data if available through tools
 * 2. Use web search to find the answer
 * 3. Show progress/steps to customer while processing (like Perplexity)
 * 4. Use AI elements to display what it's doing
 *
 * The AI should NOT:
 * - Simply explain why it can't answer without attempting to get the data
 * - Make the customer wait 3+ minutes with no feedback
 * - Deflect to manual workarounds without trying automated solutions first
 *
 * Run: npx braintrust eval evals/tiktok-analytics-questions.eval.ts
 */
Eval("TikTok Analytics Questions Evaluation", {
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
      },
    },
    {
      input: "show me @iamjuliusblack's 10 highest performing TikTok posts",
      expected:
        "A ranked list of 10 TikTok posts with URLs, view counts, likes, and captions",
      metadata: {
        artist: "Julius Black",
        platform: "tiktok",
        handle: "@iamjuliusblack",
        metric: "top_posts",
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
