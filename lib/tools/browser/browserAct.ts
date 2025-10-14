import { z } from "zod";
import { tool } from "ai";
import { withBrowser } from "@/lib/browser/withBrowser";
import { captureScreenshot } from "@/lib/browser/captureScreenshot";
import { detectPlatform } from "@/lib/browser/detectPlatform";

export interface BrowserActResult {
  success: boolean;
  message?: string;
  screenshotUrl?: string;
  sessionUrl?: string;
  platformName?: string;
  error?: string;
}

/**
 * Browser Act Tool
 * Executes natural language actions on web pages (e.g., click, type, scroll)
 */
const browserAct = tool({
  description: `Execute actions on websites using natural language commands.
  
Use this tool to interact with web pages by describing actions in plain English.

Examples:
- "click the login button"
- "type 'hello@example.com' into the email field"
- "scroll down to the bottom of the page"
- "click the 'Accept Cookies' button"

This tool will navigate to the URL and perform the specified action.`,
  inputSchema: z.object({
    url: z
      .string()
      .url()
      .describe("The URL of the webpage to interact with"),
    action: z
      .string()
      .describe(
        "Natural language description of the action to perform (e.g., 'click the submit button')"
      ),
  }),
  execute: async ({ url, action }) => {
    try {
      return await withBrowser(async (page, sessionUrl) => {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.act(action);

        const screenshotUrl = await captureScreenshot(page, url);
        const platformName = detectPlatform(url);

        return {
          success: true,
          message: `Successfully executed action: ${action}`,
          screenshotUrl,
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

export default browserAct;

