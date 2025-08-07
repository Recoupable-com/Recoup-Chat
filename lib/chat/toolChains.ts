import { anthropic } from "@ai-sdk/anthropic";
import { LanguageModel } from "ai";

export type ToolChoice = { 
  toolChoice: { type: "tool"; toolName: string };
  model?: LanguageModel;
};

// Map specific tools to their required models
export const TOOL_MODEL_MAP: Record<string, LanguageModel> = {
  update_account_info: anthropic("claude-3-7-sonnet-20250219"),
  // Add other tools that need specific models here
  // e.g., create_segments: "gpt-4-turbo",
};

// Map trigger tool -> sequence AFTER trigger  
export const TOOL_CHAINS: Record<string, readonly string[]> = {
  create_new_artist: [
    "get_spotify_search",
    "update_account_info",
    "update_artist_socials",
    "artist_deep_research", 
    "spotify_deep_research",
    "search_web",
    "update_artist_socials",
    "search_web", // repeat for new socials found
    "create_knowledge_base",
    "generate_txt_file",
    "update_account_info", // attach generated file
    "create_segments",
    "youtube_login",
  ],
  // You can add other chains here, e.g.:
  // create_campaign: ["fetch_posts", "analyze_funnel", "generate_email_copy", "schedule_campaign"],
};

type StepLike = {
  toolCalls?: { toolName: string }[];
  toolResults?: { toolName: string }[];
};

type ToolCallContent = {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  output: { type: 'json'; value: unknown };
};

/**
 * Returns the next tool to run based on timeline progression through tool chains.
 * Uses toolCallsContent to track exact execution order and position in sequence.
 */
export function getNextToolByChains(
  steps: StepLike[],
  toolCallsContent: ToolCallContent[]
): ToolChoice | undefined {
  // Build timeline of executed tools from toolCallsContent
  const executedTimeline = toolCallsContent.map(call => call.toolName);
  
  for (const [trigger, sequenceAfter] of Object.entries(TOOL_CHAINS)) {
    // Check if this chain has been triggered
    const triggerIndex = executedTimeline.indexOf(trigger);
    if (triggerIndex === -1) continue; // Chain not started
    
    const fullSequence = [trigger, ...sequenceAfter];
    
    // Find our current position in the sequence by matching timeline
    let sequencePosition = 0;
    let timelinePosition = triggerIndex;
    
    // Walk through the timeline starting from trigger
    while (timelinePosition < executedTimeline.length && sequencePosition < fullSequence.length) {
      const currentTool = executedTimeline[timelinePosition];
      const expectedTool = fullSequence[sequencePosition];
      
      if (currentTool === expectedTool) {
        sequencePosition++;
      }
      timelinePosition++;
    }
    
    // Return next tool in sequence if available
    if (sequencePosition < fullSequence.length) {
      const nextTool = fullSequence[sequencePosition];
      const toolChoice: ToolChoice = { 
        toolChoice: { type: "tool", toolName: nextTool }
      };
      
      // Add model if specified for this tool
      const model = TOOL_MODEL_MAP[nextTool];
      if (model) {
        toolChoice.model = model;
      }
      
      return toolChoice;
    }
  }
  
  return undefined;
}
