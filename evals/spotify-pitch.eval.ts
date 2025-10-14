import { Eval } from "braintrust";
import {
  callChatFunctionsWithResult,
  extractTextFromResult,
  createToolsCalledScorer,
} from "@/lib/evals";

/**
 * Spotify Pitch Tool Usage Evaluation
 *
 * This evaluation tests whether the AI properly uses tools when asked to craft
 * a Spotify for Artists pitch. The AI should:
 * 1. Search for Spotify for Artists requirements
 * 2. Use Spotify tools to get artist/album/track data
 * 3. Ask clarifying questions if needed
 * 4. NOT just respond without gathering data first
 *
 * Required Tools: search_web, web_deep_research, get_spotify_search, get_spotify_artist_top_tracks, get_spotify_artist_albums
 *
 * Run: npx braintrust eval evals/spotify-pitch.eval.ts
 */

const REQUIRED_TOOLS = [
  "search_web",
  "web_deep_research",
  "get_spotify_search",
  "get_spotify_artist_top_tracks",
  "get_spotify_artist_albums",
];

Eval("Spotify Pitch Tool Usage Evaluation", {
  data: () => [
    {
      input:
        'craft a spotify for artists pitch, in line with their requirements, about the 2 late to be toxic album and focus track "what happened 2 us". ask any questions you need to get necessary info you don\'t have',
      expected:
        "A Spotify for Artists pitch using data from Spotify tools and web research",
      metadata: {
        artist: "Unknown",
        album: "2 late to be toxic",
        track: "what happened 2 us",
        platform: "Spotify",
        request_type: "pitch_creation",
        expected_tool_usage: true,
        should_gather_data: true,
        should_ask_questions: true,
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
