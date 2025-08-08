import { ToolChainItem } from "../toolChains";
import { ModelMessage } from "ai";
import { referenceReleaseReport } from "./referenceReleaseReport";

/**
 * Creates a reference message with the release report example
 */
const getReleaseReportReferenceMessage = (): ModelMessage => {
  return {
    role: "user",
    content: [
      {
        type: "text" as const,
        text: `Here is an example release report for reference. Use this as a template for creating your own release reports:

        ${referenceReleaseReport}`,
      },
    ],
  };
};

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
    system: `Create a Release Report with the information you have gathered about the release across spotify, youtube and web search.
      The following sections must be included in the report: 
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
      - - {artwork title} Victory Lap Asset: `,
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
