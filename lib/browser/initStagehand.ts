import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

/**
 * Initializes a Stagehand instance with Browserbase configuration
 * @returns Promise<{ stagehand: Stagehand, sessionUrl?: string }> - Configured Stagehand instance and session URL
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
    enableCaching: true,
    headless: true,
    logger: (message: {
      category?: string;
      message: string;
      level?: number;
    }) => {
      console.log(`[Stagehand ${message.category || "info"}]:`, message.message);
    },
  });

  await stagehand.init();

  // Get the Browserbase session info for live view URL
  const context = stagehand.context;
  let sessionUrl: string | undefined;

  try {
    // Access the Browserbase session ID from the context
    const sessionId = (context as any)._browserbaseSessionId || (context as any).sessionId;
    if (sessionId) {
      // Construct the live debug URL
      sessionUrl = `https://www.browserbase.com/sessions/${sessionId}`;
      console.log(`[Stagehand] Session URL: ${sessionUrl}`);
    }
  } catch (error) {
    console.log("[Stagehand] Could not retrieve session URL:", error);
  }

  return { stagehand, sessionUrl };
}

/**
 * Converts a plain object schema to a Zod schema
 * This allows passing schema definitions from tool calls
 */
export function schemaToZod(schema: Record<string, any>): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const [key, type] of Object.entries(schema)) {
    if (typeof type === "string") {
      switch (type.toLowerCase()) {
        case "string":
          shape[key] = z.string();
          break;
        case "number":
          shape[key] = z.number();
          break;
        case "boolean":
          shape[key] = z.boolean();
          break;
        case "array":
          shape[key] = z.array(z.unknown());
          break;
        default:
          shape[key] = z.unknown();
      }
    } else {
      shape[key] = z.unknown();
    }
  }

  return z.object(shape);
}

