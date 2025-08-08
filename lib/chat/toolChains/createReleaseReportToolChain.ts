import { ToolChainItem } from "./toolChains";
import { ModelMessage } from "ai";

/**
 * Creates a reference message with the release report example
 */
const getReleaseReportReferenceMessage = (): ModelMessage => {
  return {
    role: "user",
    content: [
      {
        type: "text" as const,
        text: "Here is an example release report for reference. Use this as a template for creating your own release reports:",
      },
      {
        type: "file" as const,
        data: "https://arweave.net/SBPL1Sp_kwTAg5q2gIsPrGzcx1aorpqNBsIv1svLOLQ",
        mediaType: "text/markdown",
        filename: "release-report-reference.md",
      },
    ],
  };
};

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
    messages: [getReleaseReportReferenceMessage()],
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
