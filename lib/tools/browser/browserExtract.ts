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
    try {
      console.log('[browser_extract] Starting extraction:', { url, schema, instruction });
      
      return await withBrowser(async (page, sessionUrl) => {
        console.log('[browser_extract] Browser initialized, navigating to:', url);
        await page.goto(url, { waitUntil: "domcontentloaded" });

        const screenshotUrl = await captureScreenshot(page, url);
        const platformName = detectPlatform(url);

        console.log('[browser_extract] Converting schema to Zod');
        const zodSchema = schemaToZod(schema);

        console.log('[browser_extract] Extracting data with schema:', zodSchema);
        const extractResult = await page.extract({
          instruction: instruction || `Extract data according to the provided schema`,
          schema: zodSchema,
        });

        console.log('[browser_extract] Extraction successful:', extractResult);
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
      console.error('[browser_extract] Error occurred:', error);
      console.error('[browser_extract] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export default browserExtract;

