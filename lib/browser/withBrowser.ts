import type { Page } from "@browserbasehq/stagehand";
import { initStagehand } from "./initStagehand";

/**
 * Higher-order function that wraps browser operations with automatic resource cleanup
 * Handles initialization, error handling, and cleanup of Stagehand instances
 * 
 * @param operation - Async function that receives the page and sessionUrl
 * @returns Result of the operation
 * @throws Re-throws errors after cleanup
 */
export async function withBrowser<T>(
  operation: (page: Page, sessionUrl?: string) => Promise<T>
): Promise<T> {
  const { stagehand, sessionUrl } = await initStagehand();

  try {
    const result = await operation(stagehand.page, sessionUrl);
    await stagehand.close();
    return result;
  } catch (error) {
    try {
      await stagehand.close();
    } catch (closeError) {
      // Cleanup failed, but still throw original error
    }
    throw error;
  }
}

