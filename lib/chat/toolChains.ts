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
  // You can add other chains here, e.g.:
  // create_campaign: [
  //   { toolName: "fetch_posts" },
  //   { toolName: "analyze_funnel" },
  //   { toolName: "generate_email_copy" },
  //   { toolName: "schedule_campaign" }
  // ],
};

type StepLike = {
  toolCalls?: { toolName: string }[];
  toolResults?: { toolName: string }[];
};

type ToolCallContent = {
  type: "tool-result";
  toolCallId: string;
  toolName: string;
  output: { type: "json"; value: unknown };
};

/**
 * Returns the next tool to run based on timeline progression through tool chains.
 * Uses toolCallsContent to track exact execution order and position in sequence.
 */
export function getNextToolByChains(
  steps: StepLike[],
  toolCallsContent: ToolCallContent[]
): PrepareStepResult | undefined {
  // Build timeline of executed tools from toolCallsContent
  const executedTimeline = toolCallsContent.map((call) => call.toolName);

  for (const [trigger, sequenceAfter] of Object.entries(TOOL_CHAINS)) {
    // Check if this chain has been triggered
    const triggerIndex = executedTimeline.indexOf(trigger);
    if (triggerIndex === -1) continue; // Chain not started

    const fullSequence = [{ toolName: trigger }, ...sequenceAfter];

    // Find our current position in the sequence by matching timeline
    let sequencePosition = 0;
    let timelinePosition = triggerIndex;

    // Walk through the timeline starting from trigger
    while (
      timelinePosition < executedTimeline.length &&
      sequencePosition < fullSequence.length
    ) {
      const currentTool = executedTimeline[timelinePosition];
      const expectedTool = fullSequence[sequencePosition].toolName;

      if (currentTool === expectedTool) {
        sequencePosition++;
      }
      timelinePosition++;
    }

    // Return next tool in sequence if available
    if (sequencePosition < fullSequence.length) {
      const nextToolItem = fullSequence[sequencePosition];
      const result: PrepareStepResult = {
        toolChoice: { type: "tool", toolName: nextToolItem.toolName },
      };

      // Add system prompt if available
      if (nextToolItem.system) {
        result.system = nextToolItem.system;
      }

      // Add model if specified for this tool
      const model = TOOL_MODEL_MAP[nextToolItem.toolName];
      if (model) {
        result.model = model;
      }

      return result;
    }
  }

  return undefined;
}
