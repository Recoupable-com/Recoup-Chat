import { z } from "zod";
import { tool } from "ai";
import { getArtistSocials } from "../api/artist/getArtistSocials";
import { SPOTIFY_DEEP_RESEARCH_REQUIREMENTS } from "../consts";
import { SpotifyDeepResearchResultUIType } from "@/types/spotify";

const TOOL_CHAIN_STEPS = [
  "get_artist_socials - get spotify account",
  "get_spotify_artist_top_tracks - get top tracks with popularity scores",
  "get_spotify_artist_albums - albums for artist",
  "get_spotify_album - album from get_spotify_artist_albums. repeat this tool for the top 5 albums.",
  "<other tools to get engagement info or other missing required items>",
  "create_knowledge_base - generate a txt file with the research and attach it to the artist",
];

const getSpotifyDeepResearch = tool({
  description: `
  Performs deep research on an artist using a Spotify ID.

  Important constraints:
  • When calling **get_spotify_artist_albums**, evaluate album relevance (popularity, recency, major releases).
  • Call **get_spotify_album** for **at most 5** of the most relevant albums (typically the top 5 by popularity or most recent releases). Do NOT fetch details for every album—limit it to those five.

  Follows this tool loop:
  <tool_loop>
  ${TOOL_CHAIN_STEPS.join("\n")}
  </tool_loop>

  If this tool is executed as part of the **create_new_artist** workflow, once this deep research loop is complete you MUST automatically continue with the remaining steps in the *create_new_artist* tool chain (do not wait for user confirmation).

  Required items in the deep-research document:
  ${SPOTIFY_DEEP_RESEARCH_REQUIREMENTS}

  Keep going until the job is completely solved before ending your turn.
  If you're unsure, use your tools, don't guess.
  Plan thoroughly before every tool call and reflect on the outcome after each tool call.
  `,
  inputSchema: z.object({
    artist_account_id: z.string().describe("Artist account ID to research"),
  }),
  execute: async ({
    artist_account_id,
  }): Promise<SpotifyDeepResearchResultUIType> => {
    const data = await getArtistSocials(artist_account_id);
    return {
      artistSocials: data,
      artist_account_id,
      success: true,
      nextSteps: TOOL_CHAIN_STEPS,
    } as SpotifyDeepResearchResultUIType;
  },
});

export default getSpotifyDeepResearch;
