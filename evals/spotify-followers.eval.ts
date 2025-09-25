import { Eval } from "braintrust";
import { AnswerCorrectness } from "autoevals";
import { callChatFunctions } from "@/lib/evals";
import { getSpotifyFollowers } from "@/lib/spotify/getSpotifyFollowers";

/**
 * Spotify Followers Evaluation
 *
 * This evaluation tests whether your AI system properly uses tool calls
 * to fetch Spotify follower data instead of defaulting to "I don't have access" responses.
 *
 * Run: npx braintrust eval evals/spotify-followers.eval.ts
 */

// Cache for storing fetched data during evaluation run
const spotifyDataCache = new Map<
  string,
  { followerCount: number; expected: string }
>();

async function fetchSpotifyData(artist: string) {
  if (spotifyDataCache.has(artist)) {
    return spotifyDataCache.get(artist)!;
  }

  try {
    const followerCount = await getSpotifyFollowers(artist);
    const expected = `${artist} has ${followerCount} followers on Spotify.`;

    const data = { followerCount, expected };
    spotifyDataCache.set(artist, data);
    return data;
  } catch (error) {
    console.error(`Error fetching Spotify followers for "${artist}":`, error);
    const fallbackExpected = `${artist} has follower data that could not be retrieved at this time. Please try again later.`;
    const data = { followerCount: 0, expected: fallbackExpected };
    spotifyDataCache.set(artist, data);
    return data;
  }
}

Eval("Spotify Followers Evaluation", {
  data: async () => {
    const artists = [
      "Gliiico",
      "Mac Miller",
      "Wiz Khalifa",
      "Mod Sun",
      "Julius Black",
    ];

    // Fetch fresh data for all artists
    const testCases = await Promise.all(
      artists.map(async (artist) => {
        const { expected } = await fetchSpotifyData(artist);
        return {
          input: `how many total followers does ${artist} have on Spotify`,
          expected,
          metadata: {
            artist,
            platform: "Spotify",
            expected_tool_usage: true,
            data_type: "spotify_followers",
          },
        };
      })
    );

    return testCases;
  },

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
