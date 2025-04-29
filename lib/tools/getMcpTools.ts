import getSegmentFans from "./getSegmentFans";
import contactTeam from "./contactTeam";
import getArtistComments from "./getArtistComments";
import getArtistSegments from "./getArtistSegments";
import getArtistSocials from "./getArtistSocials";
import getSocialPosts from "./getSocialPosts";
import { getPerplexityTools } from "./getPerplexityTools";

export async function getMcpTools() {
  const perplexityTools = await getPerplexityTools();

  const tools = {
    contact_team: contactTeam,
    get_artist_comments: getArtistComments,
    get_artist_segments: getArtistSegments,
    get_artist_socials: getArtistSocials,
    get_segment_fans: getSegmentFans,
    get_social_posts: getSocialPosts,
    ...perplexityTools,
  };

  return tools;
}
