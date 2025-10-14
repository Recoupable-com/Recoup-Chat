import { z } from "zod";
import { tool } from "ai";
import { initStagehand } from "@/lib/browser/initStagehand";
import { uploadScreenshot } from "@/lib/browser/uploadScreenshot";

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
    let stagehandInstance;

    try {
      console.log(`[browserAct] Starting - URL: ${url}, Action: ${action}`);
      
      // Initialize Stagehand with Browserbase
      const { stagehand, sessionUrl } = await initStagehand();
      stagehandInstance = stagehand;
      const page = stagehand.page;

      console.log(`[browserAct] Navigating to ${url}...`);
      // Navigate to the URL
      await page.goto(url, { waitUntil: "domcontentloaded" });

      console.log(`[browserAct] Executing action: ${action}`);
      // Execute the action using natural language
      await page.act(action);

      console.log(`[browserAct] Action completed successfully`);

      // Take screenshot and upload to storage
      const screenshotBase64 = await page.screenshot({ encoding: "base64" });
      const platformName = url.includes("instagram") ? "instagram" : 
                          url.includes("facebook") ? "facebook" :
                          url.includes("tiktok") ? "tiktok" :
                          url.includes("youtube") ? "youtube" :
                          url.includes("x.com") || url.includes("twitter") ? "x" :
                          url.includes("threads") ? "threads" : "browser";
      
      const screenshotUrl = await uploadScreenshot(screenshotBase64 as string, platformName);

      // Close the browser
      await stagehand.close();

      return {
        success: true,
        message: `Successfully executed action: ${action}`,
        screenshotUrl,
        sessionUrl,
        platformName,
      };
    } catch (error) {
      console.error("[browserAct] Error:", error);
      
      // Ensure browser is closed on error
      if (stagehandInstance) {
        try {
          await stagehandInstance.close();
        } catch (closeError) {
          console.error("[browserAct] Error closing Stagehand:", closeError);
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export default browserAct;

