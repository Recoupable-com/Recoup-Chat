import { ToolChainItem } from "../toolChains";
import getReleaseReportReferenceMessage from "./getReleaseReportReferenceMessage";

export const createReleaseReportToolChain: ToolChainItem[] = [
  {
    toolName: "web_deep_research",
    messages: [getReleaseReportReferenceMessage()],
  },
  {
    toolName: "create_knowledge_base",
    messages: [getReleaseReportReferenceMessage()],
  },
  {
    toolName: "generate_txt_file",
    system: `Create a Release Report TXT file matching the reference release report.
      Do not make up any data. Only use the data that is present in the web_deep_research tool results.
      The following sections must be included in the report (only if the data is present in the web_deep_research tool results) passed to the contents parameter in the generate_txt_file tool: 
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
      - Citations (links to the sources generated in the web_deep_research tool)`,
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
