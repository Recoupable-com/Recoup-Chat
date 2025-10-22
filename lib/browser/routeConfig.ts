import { BROWSER_TIMEOUTS } from "./constants";

/**
 * Shared Next.js route configuration for all browser API endpoints
 */
export const browserRouteConfig = {
  runtime: 'nodejs' as const,
  dynamic: 'force-dynamic' as const,
  revalidate: 0,
  fetchCache: 'force-no-store' as const,
  maxDuration: BROWSER_TIMEOUTS.BROWSER_AGENT_TIMEOUT_MS / 1000, // Convert ms to seconds
};

