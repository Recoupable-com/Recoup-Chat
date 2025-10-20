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
 * - "What videos on IG reels caused the spike in 'The Thrill'?" - Should scrape Instagram for song usage data
 * - "Fetch streaming trend and playlist-add history for 90 days" - Should use web search and Spotify tools for trend data
 * - "Find press/interviews/moments for Wiz Khalifa" - Should use web search to find visibility events and streaming impact
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
        request_type: "follower_counts",
        requiredTools: REQUIRED_TOOLS,
        penalizedTools: PENALIZED_TOOLS,
      },
    },
    {
      input:
        'What videos on IG reels over the last 24 hours caused the spike in the song "The Thrill" being used in short form content?',
      expected:
        "List of Instagram Reels videos that used 'The Thrill' in the last 24 hours, with view counts and engagement data from scraping",
      metadata: {
        artist: "Unknown",
        platform: "instagram",
        request_type: "song_usage_tracking",
        requiredTools: REQUIRED_TOOLS,
        penalizedTools: PENALIZED_TOOLS,
      },
    },
    {
      input:
        "Fetch streaming trend and playlist-add history for the last 90 days (shows what's actually growing).",
      expected:
        "Streaming trend data and playlist-add history from Spotify tools and web search",
      metadata: {
        artist: "Unknown",
        platform: "spotify",
        request_type: "streaming_trends",
        requiredTools: REQUIRED_TOOLS,
        penalizedTools: PENALIZED_TOOLS,
      },
    },
    {
      input:
        "Can you help me find strong press, interviews or moments in the last year that Wiz Khalifa was part of? Example: He did NPR's Tiny Desk in June [https://www.youtube.com/watch?v=grWRQ0cONXA]. Trying to see what big moments he had that brought him more visibility and streaming uplift",
      expected:
        "List of press moments, interviews, and visibility events for Wiz Khalifa from web search, with streaming impact analysis",
      metadata: {
        artist: "Wiz Khalifa",
        platform: "multiple",
        request_type: "press_moments_research",
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
