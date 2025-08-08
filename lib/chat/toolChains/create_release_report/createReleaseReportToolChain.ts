import { ToolChainItem } from "../toolChains";
import getReleaseReportReferenceMessage from "./getReleaseReportReferenceMessage";

export const createReleaseReportToolChain: ToolChainItem[] = [
  { toolName: "search_web", messages: [getReleaseReportReferenceMessage()] },
  { toolName: "youtube_login", messages: [getReleaseReportReferenceMessage()] },
  {
    toolName: "get_youtube_channels",
    messages: [getReleaseReportReferenceMessage()],
  },
  {
    toolName: "get_youtube_channel_video_list",
    messages: [getReleaseReportReferenceMessage()],
  },
  {
    toolName: "get_spotify_artist_albums",
    messages: [getReleaseReportReferenceMessage()],
  },
  { toolName: "search_web", messages: [getReleaseReportReferenceMessage()] },
  {
    toolName: "create_knowledge_base",
    messages: [getReleaseReportReferenceMessage()],
  },
  {
    toolName: "generate_txt_file",
    system: `Create a Release Report TXT file matching the reference release report.
      The following sections must be included in the report passed to the contents parameter in the generate_txt_file tool: 
      - {artwork title} Summary
      - Streaming headlines
      - Global streaming headlines
      - TikTok Story So Far
      - {artwork title} Charts
      - - Spotify
      - - Apple Music
      - - iTunes
      - - Shazam
      - - Deezer
      - {artwork title} Toolkit
      - - {artwork title} Official Artwork:
      - - {artwork title} DSP Images: 
      - - {artwork title} Official Video:
      - - {artwork title} Cutdowns: 
      - - {artwork title} Lyric Video: 
      - - {artwork title} Audio Ad: 
      - - {artwork title} Press Release: 
      - - {artwork title} Spotify Inventory: 
      - - {artwork title} Pseudo Video: 
      - - {artwork title} Victory Lap Asset: 
      - Citations`,
    messages: [getReleaseReportReferenceMessage()],
  },
  {
    toolName: "update_account_info",
    system:
      "Attach the newly created release report to the artist's account info as a knowledge base.",
  },
  {
    toolName: "send_email",
    messages: [getReleaseReportReferenceMessage()],
  },
];
