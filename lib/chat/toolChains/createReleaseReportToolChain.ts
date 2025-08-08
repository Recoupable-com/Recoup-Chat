import { ToolChainItem } from "./toolChains";

export const createReleaseReportToolChain: ToolChainItem[] = [
  { toolName: "search_web" },
  { toolName: "youtube_login" },
  { toolName: "get_youtube_channels" },
  { toolName: "get_youtube_channel_video_list" },
  { toolName: "get_spotify_artist_albums" },
  { toolName: "search_web" },
  { toolName: "create_knowledge_base" },
  {
    toolName: "generate_txt_file",
    system:
      "Create a Release Report with the information you have gathered about the release across spotify, youtube and web search.",
  },
  {
    toolName: "update_account_info",
    system:
      "Attach the newly created release report to the artist's account info as a knowledge base.",
  },
  {
    toolName: "send_email",
  },
];
