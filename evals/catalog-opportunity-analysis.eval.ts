import { Eval } from "braintrust";
import { callChatFunctions } from "@/lib/evals";
import { CatalogAvailability } from "@/lib/evals/scorers/CatalogAvailability";

/**
 * Catalog Opportunity Analysis Evaluation
 *
 * This evaluation tests whether the AI system can effectively analyze catalog opportunities
 * and provide relevant song recommendations for specific use cases like playlists, sync opportunities,
 * or thematic collections. It focuses on the system's ability to understand context and suggest
 * appropriate songs from the catalog.
 *
 * Run: npx braintrust eval evals/catalog-opportunity-analysis.eval.ts
 */

const expected = `Here are some great Halloween-themed songs perfect for a Peloton Halloween playlist:
- Lord Infamous & II-Tone - "Helloween"
- th1rt3en & Pharoahe Monch – "The Exorcist"
- DC The Don – "Zombieland"
- DC The Don – "Freddy Krueger"

These songs provide the perfect spooky atmosphere while maintaining the high-energy vibe needed for Peloton workouts. The mix includes both classic Halloween hits and darker, more intense tracks that will keep riders motivated during their Halloween-themed rides.`;

Eval("Catalog Opportunity Analysis Evaluation", {
  data: () => [
    {
      input: "Peloton needs songs for a Halloween playlist",
      expected,
      metadata: {
        category: "playlist_recommendation",
        use_case: "peloton_halloween",
        expected_tool_usage: true,
        data_type: "catalog_analysis",
        requires_web_search: true,
        target_platform: "peloton",
        theme: "halloween",
      },
    },
    {
      input: "Brands need Christmas Songs for Sync",
      expected,
      metadata: {
        category: "sync_licensing",
        use_case: "brand_christmas_sync",
        expected_tool_usage: true,
        data_type: "catalog_analysis",
        requires_web_search: true,
        target_platform: "brand_sync",
        theme: "christmas",
      },
    },
    {
      input: "Spotify needs songs for a LGBTQ+ Valentines Mix",
      expected,
      metadata: {
        category: "playlist_recommendation",
        use_case: "spotify_lgbtq_valentines",
        expected_tool_usage: true,
        data_type: "catalog_analysis",
        requires_web_search: true,
        target_platform: "spotify",
        theme: "lgbtq_valentines",
      },
    },
    {
      input: "Spotify needs songs for Black History Month",
      expected,
      metadata: {
        category: "playlist_recommendation",
        use_case: "spotify_black_history_month",
        expected_tool_usage: true,
        data_type: "catalog_analysis",
        requires_web_search: true,
        target_platform: "spotify",
        theme: "black_history_month",
      },
    },
    {
      input: "Apple needs songs for International Women's Day",
      expected,
      metadata: {
        category: "playlist_recommendation",
        use_case: "apple_international_womens_day",
        expected_tool_usage: true,
        data_type: "catalog_analysis",
        requires_web_search: true,
        target_platform: "apple",
        theme: "international_womens_day",
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

  scores: [CatalogAvailability],
});
