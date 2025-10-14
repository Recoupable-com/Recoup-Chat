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
  description: `Execute actions on web pages using natural language commands.

WHEN TO USE THIS TOOL:
✓ Dismissing login popups and modals
✓ Clicking buttons, links, or interactive elements
✓ Scrolling, navigating within a page
✓ Accepting cookies or dismissing overlays
✓ BEFORE browser_extract if a popup is blocking content

HANDLING LOGIN WALLS & POPUPS:
CRITICAL: Most social media sites show public data even with login popups.
• First, try to DISMISS the login popup rather than logging in:
  ✓ "close the login dialog"
  ✓ "click 'Not Now'"
  ✓ "click the X button to close the popup"
  ✓ "dismiss the sign in modal"
• Instagram, TikTok, Twitter often have "Continue as Guest" or close buttons
• If you can't dismiss it, the data might still be extractable in the background

COMMON ACTIONS:
• Popup dismissal: "close the login popup", "click 'Maybe Later'"
• Cookie consent: "click 'Accept All Cookies'"
• Navigation: "scroll to the bottom", "click 'Load More'"
• Forms: "click the search button", "submit the form"

WORKFLOW EXAMPLE:
1. Use browser_act: "close the login dialog"
2. Then use browser_extract to get the data

IMPORTANT NOTES:
• Don't try to actually log in unless you have credentials
• Public profiles are viewable without authentication
• Dismissing popups usually reveals the underlying content`,
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

