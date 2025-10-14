import { Stagehand } from "@browserbasehq/stagehand";

/**
 * Initializes a Stagehand instance with Browserbase configuration
 */
export async function initStagehand(): Promise<{
  stagehand: Stagehand;
  sessionUrl?: string;
}> {
  const apiKey = process.env.BROWSERBASE_API_KEY;
  const projectId = process.env.BROWSERBASE_PROJECT_ID;

  if (!apiKey || !projectId) {
    throw new Error(
      "Missing Browserbase credentials. Please set BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID environment variables."
    );
  }

  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    apiKey,
    projectId,
    enableCaching: false, // Disabled for Vercel serverless (no writable cache directory)
    verbose: 1,
    logger: console.log,
    disablePino: true, // Required for Vercel/serverless environments
  });

  await stagehand.init();

  const context = stagehand.context;
  let sessionUrl: string | undefined;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionId = (context as any)._browserbaseSessionId || (context as any).sessionId;
    if (sessionId) {
      sessionUrl = `https://www.browserbase.com/sessions/${sessionId}`;
    }
  } catch {
    // Session URL retrieval failed, continue without it
  }

  return { stagehand, sessionUrl };
}

