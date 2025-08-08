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
        data: "https://arweave.net/Ai905mCZrs8P4CG76G7UPwk4ejR-JdfToowVMl0D6c4",
        mediaType: "text/plain",
        filename: "release-report-reference.txt",
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
    messages: [getReleaseReportReferenceMessage()],
  },
];
