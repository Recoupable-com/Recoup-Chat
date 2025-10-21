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
  description: `**USE WHEN:** User requests SPECIFIC data fields by name (follower count, price, bio, etc.) or says "extract", "get", "pull", "scrape" with field names.

Returns clean, structured JSON data. Requires knowing what fields you want.

TRIGGER WORDS that indicate this tool:
- "extract", "get", "pull", "scrape", "fetch" + specific field names
- Mentions exact data: "follower count", "price", "rating", "bio", "title"
- "I need [field1], [field2], and [field3]"

EXAMPLES that should use browser_extract:
✓ "Extract follower count and bio from instagram.com/artist"
✓ "Get the price and rating from this product page"
✓ "Pull subscriber count and video count from YouTube"
✓ "Scrape title, author, and publish date from this article"

DO NOT USE for general viewing (use browser_observe instead):
✗ "What's on this page" → use browser_observe
✗ "Show me their profile" → use browser_observe  
✗ "See what's on fatbeats.com" → use browser_observe

SCHEMA NOTES:
- User doesn't need to provide schema - you build it from their request
- Use "string" type for social metrics (handles "1.2M" format)
- Max 6 fields recommended for best results`,
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

