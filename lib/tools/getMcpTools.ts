import { ToolSet } from "ai";
import createTxtFile from "./createTxtFile";
import getSegmentFans from "./getSegmentFans";
import getArtistSegments from "./getArtistSegments";
import getSocialPosts from "./getSocialPosts";
import getPostComments from "./getPostComments";
import { searchWeb, webDeepResearch } from "./searchWeb";
import searchGoogleImages from "./searchGoogleImages";
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
import getSocialFans from "./getSocialFans";
import createSegments from "./createSegments";
import createReleaseReport from "./createReleaseReport";
import youtubeTools from "./youtube";
import filesTools from "./files";
import browserTools from "./browser";

export function getMcpTools(): ToolSet {
  const tools = {
    generate_txt_file: createTxtFile,
    create_segments: createSegments,
    get_artist_segments: getArtistSegments,
    get_segment_fans: getSegmentFans,
    get_social_posts: getSocialPosts,
    get_post_comments: getPostComments,
    search_web: searchWeb,
    search_google_images: searchGoogleImages,
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
    get_social_fans: getSocialFans,
    create_release_report: createReleaseReport,
    ...filesTools,
    ...youtubeTools,
    ...browserTools,
  };

  return tools;
}
