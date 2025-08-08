import { ToolChainItem } from "./toolChains";

export const createReleaseReportToolChain: ToolChainItem[] = [
  { toolName: "get_youtube_channel_video_list" },
  { toolName: "get_spotify_artist_albums" },
  { toolName: "create_knowledge_base" },
  {
    toolName: "generate_txt_file",
    system: "Create a Release Report  with the information you have gathered.",
  },
  {
    toolName: "update_account_info",
    system:
      "Attach the newly created release report to the artist's account info as a knowledge base.",
  },
  {
    toolName: "send_email",
    system:
      "Send the release report to the artist's email address. Use the email address from the account info. Include a link to the release report.",
  },
];
