import generateImage from "./generateImage";
import createTxtFile from "./createTxtFile";
import getSegmentFans from "./getSegmentFans";
import contactTeam from "./contactTeam";
import getArtistSegments from "./getArtistSegments";
import getArtistSocials from "./getArtistSocials";
import getSocialPosts from "./getSocialPosts";
import getPostComments from "./getPostComments";
import searchWeb from "./searchWeb";
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
import webDeepResearch from "./webDeepResearch";

export async function getMcpTools() {
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
    web_deep_research: webDeepResearch,
    create_knowledge_base: createKnowledgeBase,
    get_video_game_campaign_plays: getVideoGameCampaignPlays,
    send_email: sendEmailTool,
    create_scheduled_actions: createScheduledActions,
    get_scheduled_actions: getScheduledActions,
    update_scheduled_action: updateScheduledAction,
    delete_scheduled_actions: deleteScheduledAction,
    get_social_fans: getSocialFans,
    create_release_report: createReleaseReport,
    ...youtubeTools,
  };

  return tools;
}
