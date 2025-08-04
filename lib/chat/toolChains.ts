export type ToolChoice = { toolChoice: { type: "tool"; toolName: string } };

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
    "create_knowledge_base",
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

/**
 * Returns the next tool to run for any registered chain.
 */
export function getNextToolByChains(steps: StepLike[]): ToolChoice | undefined {
  const executed = new Set<string>();
  steps.forEach((s) => {
    s.toolCalls?.forEach((c) => executed.add(c.toolName));
    s.toolResults?.forEach((r) => executed.add(r.toolName));
  });

  for (const [trigger, sequenceAfter] of Object.entries(TOOL_CHAINS)) {
    if (!executed.has(trigger)) continue; // this chain not started yet
    const fullSequence = [trigger, ...sequenceAfter];
    const next = fullSequence.find((tool) => !executed.has(tool));
    if (next) return { toolChoice: { type: "tool", toolName: next } };
  }
  return undefined;
} 