import { z } from "zod";
import { tool } from "ai";
import { withBrowser } from "@/lib/browser/withBrowser";
import { captureScreenshot } from "@/lib/browser/captureScreenshot";
import { detectPlatform } from "@/lib/browser/detectPlatform";
import { normalizeInstagramUrl } from "@/lib/browser/normalizeInstagramUrl";

export interface BrowserActResult {
  success: boolean;
  message?: string;
  screenshotUrl?: string;
  sessionUrl?: string;
  platformName?: string;
  error?: string;
}

const browserAct = tool({
  description: `**USE WHEN:** User requests a SINGLE, SPECIFIC ACTION using verbs: "click", "scroll", "close", "dismiss", "accept", "submit".

Performs one interactive action on a page. Use for popups, buttons, links, or navigation.

TRIGGER WORDS that indicate this tool:
- "click", "press", "tap", "select", "choose"
- "scroll", "swipe", "navigate to"
- "close", "dismiss", "hide", "remove"
- "accept", "decline", "agree", "submit"

EXAMPLES that should use browser_act:
✓ "Click the About link on fatbeats.com"
✓ "Close the login popup"
✓ "Scroll to the bottom of the page"
✓ "Accept the cookie consent"
✓ "Dismiss the newsletter signup"

DO NOT USE for multi-step tasks (use browser_agent instead):
✗ "Click About and then tell me what you find" → use browser_agent
✗ "Navigate through the site and find contact info" → use browser_agent

NOTE: Most social media sites don't require login - browser_observe handles popups automatically.`,
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
      return await withBrowser(async (page, liveViewUrl, sessionUrl) => {
        const targetUrl = normalizeInstagramUrl(url);
        await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
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

