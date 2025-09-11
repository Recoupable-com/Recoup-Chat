/**
 * Featured models configuration for the model selection dropdown
 * These models will be displayed prominently at the top of the dropdown
 */

export interface FeaturedModelConfig {
  /** The model ID that should match the one from AI Gateway */
  id: string;
  /** Display name for the model */
  displayName: string;
  /** Whether this is a pro model (requires subscription) */
  isPro: boolean;
  /** Optional pill/badge text (e.g., "Fast", "New", "Thinking") */
  pill?: string;
  /** Optional description text shown under the model name */
  description?: string;
  /** Optional tooltip text shown on hover (more detailed description) */
  tooltip?: string;
}

/**
 * Featured models to display at the top of the dropdown in priority order
 * Note: These are ACTUAL model IDs verified to exist in the system via /api/ai/models
 * Order is determined by array position (first = highest priority)
 */
export const FEATURED_MODELS: FeaturedModelConfig[] = [
  {
    id: "fal-ai/nano-banana/edit",
    displayName: "Nano Banana",
    isPro: false,
    pill: "Image",
    description: "Great for image editing",
    tooltip: "Google's nano banana model via Fal - perfect for image editing and generation",
  },
  {
    id: "google/gemini-2.5-flash-lite",
    displayName: "Gemini 2.5 Flash",
    isPro: false,
    pill: "Fast",
    description: "Great for speed",
    tooltip: "Google's fastest model",
  },
  {
    id: "openai/gpt-5-mini",
    displayName: "GPT-5 Mini",
    isPro: false,
    description: "Great for everyday",
    tooltip: "OpenAI's faster model",
  },
  {
    id: "anthropic/claude-sonnet-4",
    displayName: "Claude Sonnet 4",
    isPro: true,
    description: "Great for agents",
    tooltip: "Anthropic's latest model",
  },
  {
    id: "openai/gpt-5",
    displayName: "GPT-5",
    isPro: true,
    pill: "New",
    description: "Great for analytics",
    tooltip: "OpenAI's flagship model",
  },
  {
    id: "google/gemini-2.5-pro",
    displayName: "Gemini 2.5 Pro",
    isPro: true,
    description: "Great for complex tasks",
    tooltip: "Google's flagship model",
  },
  {
    id: "xai/grok-4",
    displayName: "Grok 4",
    isPro: true,
    description: "Great for writing",
    tooltip: "Xai's reasoning model",
  },
];

/**
 * Check if a model ID is in the featured list
 */
export const isFeaturedModel = (modelId: string): boolean => {
  return FEATURED_MODELS.some(model => model.id === modelId);
};

/**
 * Get featured model config by ID
 */
export const getFeaturedModelConfig = (modelId: string): FeaturedModelConfig | undefined => {
  return FEATURED_MODELS.find(model => model.id === modelId);
};