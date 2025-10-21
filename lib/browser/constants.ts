/**
 * Browser automation timeout and limit constants
 */

// Timeout durations (in milliseconds)
export const BROWSER_TIMEOUTS = {
  INITIAL_PAGE_LOAD: 3000,
  MAX_VISIBLE_CONTENT_LENGTH: 3000,
} as const;

export const CONTENT_LIMITS = {
  MAX_VISIBLE_CONTENT_LENGTH: 3000,
} as const;

