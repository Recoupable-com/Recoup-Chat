import { Eval } from "braintrust";
import {
  callChatFunctionsWithResult,
  extractTextFromResult,
} from "@/lib/evals";
import { ToolsCalled } from "@/lib/evals/scorers/ToolsCalled";

/**
 * Social Scraping Evaluation
 *
 * This evaluation tests whether the AI properly handles scraping requests by:
 *
 * Required Tools: search_web, web_deep_research, get_apify_scraper, scrape_instagram_profile, scrape_instagram_comments, search_twitter, get_twitter_trends
 * Penalized Tools: contact_team
 *
 * Run: npx braintrust eval evals/social-scraping.eval.ts
 */

const REQUIRED_TOOLS = [
  "search_web",
  "web_deep_research",
  "get_apify_scraper",
  "scrape_instagram_profile",
  "scrape_instagram_comments",
  "search_twitter",
  "get_twitter_trends",
];

const PENALIZED_TOOLS = ["contact_team"];

Eval("Social Scraping Evaluation", {
  data: () => [
    {
      input:
        "Scrape all social profiles for @iamjuliusblack now. If you can't scrape certain profiles, tell me how I can get them integrated here.",
      expected:
        "Exec summary + status table with Platform/Status/Data/Gaps/Next Step, showing partial data from successful scrapes and clear next steps for failed ones",
      metadata: {
        artist: "Julius Black",
        platform: "all",
        handle: "@iamjuliusblack",
        request_type: "scrape_all_profiles",
        requiredTools: REQUIRED_TOOLS,
        penalizedTools: PENALIZED_TOOLS,
      },
    },
  ],

  task: async (input: string) => {
    try {
      const result = await callChatFunctionsWithResult(input);
      const output = extractTextFromResult(result);
      const toolCalls =
        result.toolCalls?.map((tc) => ({
          toolName: tc.toolName,
          args: {},
        })) || [];

      return { output, toolCalls };
    } catch (error) {
      return {
        output: `Error: ${error instanceof Error ? error.message : "Function call failed"}`,
        toolCalls: [],
      };
    }
  },

  scores: [
    async (args: { output: unknown; expected?: string; input: string }) => {
      // Extract output text and toolCalls
      const outputText =
        typeof args.output === "object" &&
        args.output &&
        "output" in args.output
          ? (args.output.output as string)
          : (args.output as string);

      const toolCalls =
        typeof args.output === "object" &&
        args.output &&
        "toolCalls" in args.output
          ? (args.output.toolCalls as Array<{
              toolName: string;
              args: Record<string, unknown>;
            }>)
          : undefined;

      return await ToolsCalled({
        output: outputText,
        input: args.input,
        expected: args.expected,
        toolCalls,
        requiredTools: REQUIRED_TOOLS,
        penalizedTools: PENALIZED_TOOLS,
      });
    },
  ],
});
