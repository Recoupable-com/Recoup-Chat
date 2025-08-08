import { LanguageModel } from "ai";

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
  // Add other tools that need specific models here
  // e.g., create_segments: "gpt-4-turbo",
};

// Map trigger tool -> sequence AFTER trigger
export const TOOL_CHAINS: Record<string, readonly ToolChainItem[]> = {
  create_new_artist: [
    { toolName: "get_spotify_search" },
    {
      toolName: "update_account_info",
      system:
        "Read first artist's information from the result of the get_spotify_search tool and update the account using the update_account_info tool with the artist's basic information. Information you should get is: name, image, label etc.",
    },
    { toolName: "update_artist_socials" },
    { toolName: "artist_deep_research" },
    { toolName: "spotify_deep_research" },
    { toolName: "get_artist_socials" },
    { toolName: "get_spotify_artist_top_tracks" },
    { toolName: "get_spotify_artist_albums" },
    { toolName: "get_spotify_album" },
    {
      toolName: "create_knowledge_base",
      system: "Create a knowledge base with the information you have gathered.",
    },
    { toolName: "generate_txt_file" },
    { toolName: "update_account_info" },
    { toolName: "search_web" },
    { toolName: "update_artist_socials" },
    { toolName: "search_web" },
    { toolName: "create_knowledge_base" },
    { toolName: "generate_txt_file" },
    { toolName: "update_account_info" },
    { toolName: "create_segments" },
    { toolName: "youtube_login" },
  ],
  create_release_report: [
    { toolName: "get_youtube_channel_video_list" },
    { toolName: "get_spotify_artist_albums" },
    { toolName: "create_knowledge_base" },
    {
      toolName: "generate_txt_file",
      system:
        "Create a Release Report  with the information you have gathered.",
    },
    {
      toolName: "update_account_info",
      system:
        "Attach the newly created release report to the artist's account info.",
    },
    {
      toolName: "send_email",
      system:
        "Send the release report to the artist's email address. Use the email address from the account info. Include a link to the release report.",
    },
  ],
  // You can add other chains here, e.g.:
  // create_campaign: [
  //   { toolName: "fetch_posts" },
  //   { toolName: "analyze_funnel" },
  //   { toolName: "generate_email_copy" },
  //   { toolName: "schedule_campaign" }
  // ],
};
