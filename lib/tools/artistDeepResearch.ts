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
  Conduct comprehensive cross-platform research on the artist and produce a rich knowledge base.

  You MUST execute **every** step in the following TOOL CHAIN, in the exact order, before finishing. Never skip a step, never ask the user for confirmation, and never end "thinking" early.

  <tool_loop>
  ${TOOL_CHAIN_STEPS.join("\n")}
  </tool_loop>

  Execution rules:
  1. Sequential: Execute the next tool only after the previous one succeeds.
  2. Retry logic: If a step fails, retry up to 3 times with adjusted parameters before moving on.
  3. Completion: Only finish when the final step (youtube_login) has been successfully called.
  4. No user prompts: Make all decisions automatically. Never ask the user which socials to choose or whether to proceed.

  Spotify research requirements:
  ${SPOTIFY_DEEP_RESEARCH_REQUIREMENTS}

  Other research requirements:
  - Socials: Follower counts, engagement rates, top content, branding, posting consistency
  - Website: Branding, layout, contact info, mailing list
  - YouTube: Consistency, video quality, viewership, contact info
  - Marketing: Campaign ideas, revenue streams, collaboration opportunities, brand partnerships

Continue looping over the tool chain until **all** data requirements are completely satisfied.  
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
