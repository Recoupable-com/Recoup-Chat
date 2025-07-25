import { z } from "zod";
import { tool } from "ai";
import { getArtistSocials } from "../api/artist/getArtistSocials";
import { SPOTIFY_DEEP_RESEARCH_REQUIREMENTS } from "../consts";

const TOOL_CHAIN_STEPS = [
  "spotify_deep_research - deep research the musician discography and popularity on spotify",
  "search_web - search for any missing social handles (twitter, instagram, spotify, tiktok)",
  "update_artist_socials - link the discovered socials to the artist",
  "search_web - loop over this tool until you have all the info required below",
  "create_knowledge_base - generate a research txt file and attach it to the artist",
  "create_segments - generate fan segments based on the research data",
  "youtube_login - final step, prompt user to connect YouTube for additional analytics and monetization data, it need user interaction",
];

const artistDeepResearch = tool({
  description: `
  Conducts comprehensive research on an artist across multiple platforms and generates a detailed report.
  Follows this tool loop:
  <tool_loop>
  ${TOOL_CHAIN_STEPS.join("\n")}
  </tool_loop>

  Spotify research requirements:
  ${SPOTIFY_DEEP_RESEARCH_REQUIREMENTS}

  Other research requirements:
  - Socials: Follower counts, engagement rates, top content, branding, posting consistency
  - Website: Branding, layout, contact info, mailing list
  - YouTube: Consistency, video quality, viewership, contact info
  - Marketing: Campaign ideas, revenue streams, collaboration opportunities, brand partnerships

Do not stop after initial research - continue with looping over these steps until all the required info is gathered.  
  `,
  inputSchema: z.object({
    artist_account_id: z.string().describe("Artist account ID to research"),
  }),
  execute: async ({ artist_account_id }) => {
    const data = await getArtistSocials(artist_account_id);
    return {
      artistSocials: data,
      artist_account_id,
      success: true,
      nextSteps: TOOL_CHAIN_STEPS,
    };
  },
});

export default artistDeepResearch;
