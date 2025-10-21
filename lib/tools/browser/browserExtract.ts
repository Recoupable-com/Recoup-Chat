import { z } from "zod";
import { tool } from "ai";
import { withBrowser } from "@/lib/browser/withBrowser";
import { captureScreenshot } from "@/lib/browser/captureScreenshot";
import { detectPlatform } from "@/lib/browser/detectPlatform";
import { schemaToZod } from "@/lib/browser/schemaToZod";
import { normalizeInstagramUrl } from "@/lib/browser/normalizeInstagramUrl";

export interface BrowserExtractResult {
  success: boolean;
  data?: unknown;
  initialScreenshotUrl?: string;
  finalScreenshotUrl?: string;
  sessionUrl?: string;
  platformName?: string;
  error?: string;
}

const browserExtract = tool({
  description: `🌐 WEBSITE/WEB PAGE REQUIRED - Only use when user mentions a website + wants SPECIFIC data fields.

**USE WHEN:** User says "extract/get/pull [SPECIFIC FIELDS] from [WEBSITE]" mentioning exact data they want.

MUST HAVE both:
1. Website context: domain, URL, social platform name
2. Specific fields: "follower count", "price", "bio", "rating", etc.

EXAMPLES (both requirements met):
✓ "Extract follower count and bio from instagram.com/artist"
✓ "Get price and rating from this product page"
✓ "Pull subscriber count from YouTube channel"

DO NOT USE (no website context):
✗ "Get the follower count" → NOT a browser task
✗ "Extract the data" → NOT a browser task

DO NOT USE (no specific fields):
✗ "Show me fatbeats.com" → use browser_observe

SCHEMA: Build from user's request (they don't provide it). Use "string" type for social metrics.`,
  inputSchema: z.object({
    url: z.string().url().describe("The URL of the webpage to extract data from"),
    schema: z
      .record(z.string())
      .describe(
        "Schema object defining the structure of data to extract (keys are field names, values are types: 'string', 'number', 'boolean', 'array')"
      ),
    instruction: z
      .string()
      .optional()
      .describe(
        "Optional instruction to guide the extraction (e.g., 'extract product information from the main listing')"
      ),
  }),
  execute: async ({ url, schema, instruction }) => {
    try {
      return await withBrowser(async (page, liveViewUrl, sessionUrl) => {
        const targetUrl = normalizeInstagramUrl(url);
        await page.goto(targetUrl, { waitUntil: "domcontentloaded" });

        const screenshotUrl = await captureScreenshot(page, url);
        const platformName = detectPlatform(url);

        const zodSchema = schemaToZod(schema);

        const extractResult = await page.extract({
          instruction: instruction || `Extract data according to the provided schema`,
          schema: zodSchema,
        });

        return {
          success: true,
          data: extractResult,
          initialScreenshotUrl: screenshotUrl,
          finalScreenshotUrl: screenshotUrl,
          sessionUrl,
          platformName,
        };
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export default browserExtract;

