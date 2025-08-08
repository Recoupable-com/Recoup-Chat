import { LanguageModel } from "ai";
import { createReleaseReportToolChain } from "./createReleaseReportToolChain";
import { createNewArtistToolChain } from "./createNewArtistToolChain";

export type ToolChainItem = {
  toolName: string;
  system?: string;
};

export type PrepareStepResult = {
  toolChoice?: { type: "tool"; toolName: string };
  model?: LanguageModel;
  system?: string;
};

// Map specific tools to their required models
export const TOOL_MODEL_MAP: Record<string, LanguageModel> = {
  update_account_info: "gemini-2.5-pro",
  create_knowledge_base: "openai/gpt-5",
  generate_txt_file: "openai/gpt-5-mini",
  // Add other tools that need specific models here
  // e.g., create_segments: "gpt-4-turbo",
};

// Map trigger tool -> sequence AFTER trigger
export const TOOL_CHAINS: Record<string, readonly ToolChainItem[]> = {
  create_new_artist: createNewArtistToolChain,
  create_release_report: createReleaseReportToolChain,
  // You can add other chains here, e.g.:
  // create_campaign: [
  //   { toolName: "fetch_posts" },
  //   { toolName: "analyze_funnel" },
  //   { toolName: "generate_email_copy" },
  //   { toolName: "schedule_campaign" }
  // ],
};
