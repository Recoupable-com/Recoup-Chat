import { Eval } from "braintrust";
import {
  callChatFunctionsWithResult,
  extractTextFromResult,
  createToolsCalledScorer,
} from "@/lib/evals";

/**
 * Spotify Tools Evaluation
 *
 * This evaluation tests whether the AI properly uses tools when asked to craft
 * Spotify-related pitches and strategies. The AI should:
 * 1. Search for Spotify for Artists requirements and playlist submission guidelines
 * 2. Use Spotify tools to get artist/album/track/playlist data
 * 3. Ask clarifying questions if needed
 * 4. NOT just respond without gathering data first
 *
 * Test cases:
 * - "Craft a Spotify for Artists pitch" - Should use Spotify tools to gather album/track data
 * - "Research playlists and curators" - Should search for playlists and analyze requirements
 *
 * Required Tools: search_web, web_deep_research, get_spotify_search, get_spotify_artist_top_tracks, get_spotify_artist_albums
 *
 * Run: npx braintrust eval evals/spotify-tools.eval.ts
 */

const REQUIRED_TOOLS = [
  "search_web",
  "web_deep_research",
  "get_spotify_search",
  "get_spotify_artist_top_tracks",
  "get_spotify_artist_albums",
];

Eval("Spotify Tools Evaluation", {
  data: () => [
    {
      input:
        'craft a spotify for artists pitch, in line with their requirements, about the 2 late to be toxic album and focus track "what happened 2 us". ask any questions you need to get necessary info you don\'t have',
      expected:
        "A Spotify for Artists pitch using data from Spotify tools and web research",
      metadata: {
        artist: "Unknown",
        platform: "Spotify",
        request_type: "pitch_creation",
        expected_tool_usage: true,
        requiredTools: REQUIRED_TOOLS,
      },
    },
    {
      input:
        "Research playlists in my genre and style that would be perfect for my music. Find playlist curators, analyze submission requirements, and give me a strategy for getting my songs placed on high-impact playlists.",
      expected:
        "List of relevant playlists with curator info, submission requirements, and placement strategy from Spotify tools and web research",
      metadata: {
        artist: "Unknown",
        platform: "Spotify",
        request_type: "playlist_research",
        expected_tool_usage: true,
        requiredTools: REQUIRED_TOOLS,
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

  scores: [createToolsCalledScorer(REQUIRED_TOOLS)],
});
