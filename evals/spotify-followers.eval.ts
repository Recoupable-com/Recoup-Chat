import { Eval } from "braintrust";
import { AnswerCorrectness } from "autoevals";
import { callChatFunctions } from "@/lib/evals";
import getSpotifyFollowersData from "@/lib/evals/getSpotifyFollowersData";

/**
 * Spotify Followers Evaluation
 *
 * This evaluation tests whether your AI system properly uses tool calls
 * to fetch Spotify follower data instead of defaulting to "I don't have access" responses.
 *
 * Run: npx braintrust eval evals/spotify-followers.eval.ts
 */
Eval("Spotify Followers Evaluation", {
  data: getSpotifyFollowersData,
  task: async (input: string): Promise<string> => {
    try {
      const response = await callChatFunctions(input);
      return response;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : "Function call failed"}`;
    }
  },

  scores: [AnswerCorrectness],
});
