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
  description: `🌐 WEBSITE/WEB PAGE REQUIRED - Only use when user wants to perform an action ON A WEBSITE.

**USE WHEN:** User says "click/scroll/close [SOMETHING] on [WEBSITE]" - a SINGLE action on a web page.

MUST HAVE both:
1. Website context: domain, URL, "on the page", "on their site"
2. Action verb: "click", "scroll", "close", "dismiss", "accept"

EXAMPLES (both requirements met):
✓ "Click the About link on fatbeats.com"
✓ "Scroll to the bottom of the page"
✓ "Close the popup on this website"

DO NOT USE (no website context):
✗ "Click the button" → NOT a browser task
✗ "Close the modal" → NOT a browser task (could be in-app modal)

DO NOT USE (multi-step):
✗ "Click About and tell me what you find" → use browser_agent`,
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

