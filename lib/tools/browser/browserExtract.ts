import { z } from "zod";
import { tool } from "ai";
import { withBrowser } from "@/lib/browser/withBrowser";
import { captureScreenshot } from "@/lib/browser/captureScreenshot";
import { detectPlatform } from "@/lib/browser/detectPlatform";
import { schemaToZod } from "@/lib/browser/schemaToZod";

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
  description: `Extract structured data from websites using AI-powered data extraction.

WHEN TO USE THIS TOOL:
✓ Extracting specific data points (follower counts, prices, titles, stats)
✓ Public profiles and pages (Instagram, TikTok, Twitter, LinkedIn)
✓ Product pages, listings, articles
✓ Data that's visible without authentication

HANDLING LOGIN WALLS:
• Many social platforms show public data WITHOUT requiring login
• TikTok, Instagram, Twitter profiles are publicly visible
• The AI can "see" and extract data even if there's a login popup overlay
• If extraction fails due to login, try browser_act to dismiss the popup first:
  - Use browser_act with action: "close the login dialog" or "click 'Not Now'"
  - Then retry browser_extract

SCHEMA FORMAT:
The schema defines what data to extract:
{
  "followerCount": "string",  // Use string for formatted numbers like "1.2M"
  "followingCount": "string",
  "postCount": "string",
  "bio": "string",
  "username": "string"
}

BEST PRACTICES:
• Use string type for social metrics (handles "1.2K" format)
• Be specific in field names (followerCount not just count)
• Add instruction parameter for complex pages
• Extract only the data you need (max 6 fields recommended)

EXAMPLE USE CASES:
✓ "Extract follower count from https://tiktok.com/@username"
✓ "Get price and rating from this product page"
✓ "Scrape article title and publish date"`,
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
        await page.goto(url, { waitUntil: "domcontentloaded" });

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

