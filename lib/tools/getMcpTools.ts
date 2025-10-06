import { ToolSet } from "ai";
import generateImage from "./generateImage";
import nanoBananaTools from "./nanoBanana";
import createTxtFile from "./createTxtFile";
import getSegmentFans from "./getSegmentFans";
import contactTeam from "./contactTeam";
import getArtistSegments from "./getArtistSegments";
import getArtistSocials from "./getArtistSocials";
import getSocialPosts from "./getSocialPosts";
import getPostComments from "./getPostComments";
import { searchWeb, webDeepResearch } from "./searchWeb";
import generateMermaidDiagram from "./generateMermaidDiagram";
import createArtist from "./createArtist";
import deleteArtist from "./deleteArtist";
import getSpotifySearch from "./getSpotifySearch";
import getSpotifyArtistTopTracks from "./getSpotifyArtistTopTracks";
import getSpotifyArtistAlbums from "./getSpotifyArtistAlbums";
import getSpotifyAlbum from "./getSpotifyAlbum";
import updateAccountInfo from "./updateAccountInfo";
import updateArtistSocialsTool from "./updateArtistSocials";
import searchTwitter from "./searchTwitter";
import getTwitterTrends from "./getTwitterTrends";
import scrapeInstagramProfile from "./scrapeInstagramProfile";
import getApifyScraper from "./getApifyScraper";
import scrapeInstagramComments from "./scrapeInstagramComments";
import artistDeepResearch from "./artistDeepResearch";
import getVideoGameCampaignPlays from "./getVideoGameCampaignPlays";
import getSpotifyDeepResearch from "./getSpotifyDeepResearch";
import createKnowledgeBase from "./createKnowledgeBase";
import sendEmailTool from "./sendEmailTool";
import createScheduledActions from "./scheduled_actions/createScheduledActions";
import getScheduledActions from "./scheduled_actions/getScheduledActions";
import updateScheduledAction from "./scheduled_actions/updateScheduledActions";
import deleteScheduledAction from "./scheduled_actions/deleteScheduledActions";
import getSocialFans from "./getSocialFans";
import createSegments from "./createSegments";
import createReleaseReport from "./createReleaseReport";
import youtubeTools from "./youtube";
import getLocalTime from "./getLocalTime";
import readFile  from "./files/readFile";
import listFiles  from "./files/listFiles";

export function getMcpTools(): ToolSet {
  const tools = {
    generate_image: generateImage,
    generate_txt_file: createTxtFile,
    contact_team: contactTeam,
    create_segments: createSegments,
    get_artist_segments: getArtistSegments,
    get_segment_fans: getSegmentFans,
    get_artist_socials: getArtistSocials,
    get_social_posts: getSocialPosts,
    get_post_comments: getPostComments,
    search_web: searchWeb,
    web_deep_research: webDeepResearch,
    generate_mermaid_diagram: generateMermaidDiagram,
    create_new_artist: createArtist,
    delete_artist: deleteArtist,
    get_spotify_search: getSpotifySearch,
    get_spotify_artist_top_tracks: getSpotifyArtistTopTracks,
    get_spotify_artist_albums: getSpotifyArtistAlbums,
    get_spotify_album: getSpotifyAlbum,
    update_account_info: updateAccountInfo,
    update_artist_socials: updateArtistSocialsTool,
    search_twitter: searchTwitter,
    get_twitter_trends: getTwitterTrends,
    scrape_instagram_profile: scrapeInstagramProfile,
    get_apify_scraper: getApifyScraper,
    scrape_instagram_comments: scrapeInstagramComments,
    artist_deep_research: artistDeepResearch,
    spotify_deep_research: getSpotifyDeepResearch,
    create_knowledge_base: createKnowledgeBase,
    get_video_game_campaign_plays: getVideoGameCampaignPlays,
    send_email: sendEmailTool,
    create_scheduled_actions: createScheduledActions,
    get_scheduled_actions: getScheduledActions,
    update_scheduled_action: updateScheduledAction,
    delete_scheduled_actions: deleteScheduledAction,
    get_social_fans: getSocialFans,
    create_release_report: createReleaseReport,
    get_local_time: getLocalTime,
    read_file: readFile,
    list_files: listFiles,
    ...nanoBananaTools,
    ...youtubeTools,
  };

  // // Handle potential namespacing issues with beta AI SDK
  // // Some models may try to call tools with 'default_api.' prefix
  // const namespacedTools: ToolSet = { ...tools };
  // Object.entries(tools).forEach(([key, tool]) => {
  //   // Also register with default_api prefix for compatibility with beta AI SDK
  //   namespacedTools[`default_api.${key}`] = tool;
  // });

  return tools;
}
