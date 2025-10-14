import { Eval } from "braintrust";
import {
  callChatFunctionsWithResult,
  extractTextFromResult,
  createToolsCalledScorer,
} from "@/lib/evals";

/**
 * Social Scraping Evaluation
 *
 * This evaluation tests whether the AI properly handles scraping requests by:
 * 1. Attempting scraping tools (web search, Apify, Instagram/Twitter scrapers) before giving up
 * 2. Using fresh data from scrapes instead of relying on stale database values
 * 3. Providing specific numbers/data from scraping results
 *
 * Test cases:
 * - "Scrape all social profiles" - Should attempt all available scrapers
 * - "How many Instagram followers do I have?" - Should use fresh scraping data
 * - "How many followers on TikTok and X?" - Should scrape/search for real counts, not return stale 0s
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
    {
      input: "How many Instagram followers do I have?",
      expected:
        "Specific follower count from fresh scraping (e.g., '112,545 followers')",
      metadata: {
        artist: "Fat Beats",
        platform: "instagram",
        handle: "@fatbeats",
        request_type: "follower_count",
        requiredTools: REQUIRED_TOOLS,
        penalizedTools: PENALIZED_TOOLS,
      },
    },
    {
      input: "How many followers do I have on TikTok and X?",
      expected:
        "Specific follower counts from scraping/web search (not stale database values showing 0)",
      metadata: {
        artist: "Fat Beats",
        platform: "tiktok_and_x",
        handle: "@fatbeats",
        request_type: "follower_counts",
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

  scores: [createToolsCalledScorer(REQUIRED_TOOLS, PENALIZED_TOOLS)],
});
