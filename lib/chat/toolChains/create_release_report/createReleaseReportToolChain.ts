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
