import { z } from "zod";
import { tool } from "ai";
import { getArtistSocials } from "../api/artist/getArtistSocials";
import { SPOTIFY_DEEP_RESEARCH_REQUIREMENTS } from "../consts";
import { SpotifyDeepResearchResultUIType } from "@/types/spotify";

const getSpotifyDeepResearch = tool({
  description: `
  Performs deep research on an artist using a Spotify ID.

  Required items in deep research document:
  ${SPOTIFY_DEEP_RESEARCH_REQUIREMENTS}
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
    } as SpotifyDeepResearchResultUIType;
  },
});

export default getSpotifyDeepResearch;
