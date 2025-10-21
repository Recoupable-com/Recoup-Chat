/**
 * Browser automation timeout and limit constants
 */

// Timeout durations (in milliseconds)
export const BROWSER_TIMEOUTS = {
  INITIAL_PAGE_LOAD: 3000,
  BROWSER_AGENT_TIMEOUT_MS: 300000, // 5 minutes max for agent execution
} as const;

export const CONTENT_LIMITS = {
  MAX_VISIBLE_CONTENT_LENGTH: 3000,
} as const;

export const BROWSER_AGENT_CONFIG = {
  MAX_STEPS: 100, // Maximum steps for autonomous agent execution
  DEFAULT_MODEL: "gemini-2.5-computer-use-preview-10-2025", // Default AI model for agent
} as const;

