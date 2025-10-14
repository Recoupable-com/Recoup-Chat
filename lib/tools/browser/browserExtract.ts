import { z } from "zod";
import { tool } from "ai";
import { initStagehand, schemaToZod } from "@/lib/browser/initStagehand";
import { uploadScreenshot } from "@/lib/browser/uploadScreenshot";

export interface BrowserExtractResult {
  success: boolean;
  data?: any;
  initialScreenshotUrl?: string;
  finalScreenshotUrl?: string;
  sessionUrl?: string;
  platformName?: string;
  error?: string;
}

/**
 * Browser Extract Tool
 * Extracts structured data from web pages using schemas
 */
const browserExtract = tool({
  description: `Extract structured data from websites using a defined schema.

Use this tool to scrape specific information from web pages in a structured format.

The schema should be an object where keys are field names and values are types:
- "string" for text data
- "number" for numeric data
- "boolean" for true/false values
- "array" for lists

Example schema:
{
  "title": "string",
  "price": "number",
  "inStock": "boolean",
  "features": "array"
}

You can optionally provide an instruction to guide the extraction.`,
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
    let stagehandInstance;

    try {
      console.log(`[browserExtract] Starting - URL: ${url}`);
      console.log(`[browserExtract] Schema:`, schema);
      
      // Initialize Stagehand with Browserbase
      const { stagehand, sessionUrl } = await initStagehand();
      stagehandInstance = stagehand;
      const page = stagehand.page;

      console.log(`[browserExtract] Navigating to ${url}...`);
      // Navigate to the URL
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const platformName = url.includes("instagram") ? "instagram" : 
                          url.includes("facebook") ? "facebook" :
                          url.includes("tiktok") ? "tiktok" :
                          url.includes("youtube") ? "youtube" :
                          url.includes("x.com") || url.includes("twitter") ? "x" :
                          url.includes("threads") ? "threads" : "browser";

      // Take screenshot right after page load
      console.log(`[browserExtract] Taking screenshot...`);
      const screenshotBase64 = await page.screenshot({ encoding: "base64" });
      const screenshotUrl = await uploadScreenshot(screenshotBase64 as string, platformName);
      console.log(`[browserExtract] Screenshot uploaded: ${screenshotUrl}`);

      // Convert the plain schema object to a Zod schema
      const zodSchema = schemaToZod(schema);

      console.log(`[browserExtract] Extracting data with instruction: ${instruction || "default"}`);
      // Extract data using the schema
      const extractResult = await page.extract({
        instruction: instruction || `Extract data according to the provided schema`,
        schema: zodSchema,
      });

      console.log(`[browserExtract] Extraction completed successfully`);

      // Close the browser
      await stagehand.close();

      return {
        success: true,
        data: extractResult,
        initialScreenshotUrl: screenshotUrl,
        finalScreenshotUrl: screenshotUrl, // Use same screenshot
        sessionUrl,
        platformName,
      };
    } catch (error) {
      console.error("[browserExtract] Error:", error);
      
      // Ensure browser is closed on error
      if (stagehandInstance) {
        try {
          await stagehandInstance.close();
        } catch (closeError) {
          console.error("[browserExtract] Error closing Stagehand:", closeError);
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export default browserExtract;

