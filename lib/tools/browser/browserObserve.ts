import { z } from "zod";
import { tool } from "ai";
import { withBrowser } from "@/lib/browser/withBrowser";
import { captureScreenshot } from "@/lib/browser/captureScreenshot";
import { detectPlatform } from "@/lib/browser/detectPlatform";
import { normalizeInstagramUrl } from "@/lib/browser/normalizeInstagramUrl";
import { simulateHumanScrolling } from "@/lib/browser/simulateHumanScrolling";
import { dismissLoginModal } from "@/lib/browser/dismissLoginModal";
import { formatActionsToString } from "@/lib/browser/formatActionsToString";
import { BROWSER_TIMEOUTS, CONTENT_LIMITS } from "@/lib/browser/constants";

export interface BrowserObserveResult {
  success: boolean;
  message?: string;
  screenshotUrl?: string;
  sessionUrl?: string;
  platformName?: string;
  error?: string;
}

const browserObserve = tool({
  description: `**USE WHEN:** User asks to "see", "show me", "what's on", "view", or "check out" a page WITHOUT specifying exact fields to extract.

Quick page viewing that returns ALL visible text content (up to 3000 chars). Perfect for exploration and general questions about what's on a page.

TRIGGER WORDS that indicate this tool:
- "show me", "what's on", "see", "view", "check out", "look at"
- "what does [url] say", "what's visible on", "read the page"
- Questions WITHOUT specific field names

EXAMPLES that should use browser_observe:
✓ "What's on instagram.com/artist"
✓ "Show me this TikTok profile"
✓ "See what's on their Facebook page"
✓ "View the homepage at fatbeats.com"
✓ "What's visible on this website"

DO NOT USE if user specifies exact fields (use browser_extract instead):
✗ "Get follower count and bio" → use browser_extract
✗ "Extract the price and rating" → use browser_extract

AUTOMATIC FEATURES:
• Dismisses login popups automatically
• Returns all visible text (follower counts, bios, stats, prices, dates)
• Takes screenshot for visual confirmation
• Works on Instagram, TikTok, Twitter, YouTube, Facebook
• Provides session recording link`,
  inputSchema: z.object({
    url: z
      .string()
      .url()
      .describe("The URL of the webpage to observe"),
    instruction: z
      .string()
      .optional()
      .describe(
        "Optional instruction to guide the observation (e.g., 'find submit buttons', 'locate navigation menu')"
      ),
  }),
  execute: async ({ url, instruction }) => {
    try {
      return await withBrowser(async (page, liveViewUrl, sessionUrl) => {
        const targetUrl = normalizeInstagramUrl(url);
        await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
        
        // Wait for initial page load
        await page.waitForTimeout(BROWSER_TIMEOUTS.INITIAL_PAGE_LOAD);

        await simulateHumanScrolling(page);

        const modalDismissed = await dismissLoginModal(page);
        
        const { visibleContent } = await page.extract({
          instruction: "Extract all visible text content from the page including follower counts, bios, and stats",
          schema: z.object({
            visibleContent: z.string().describe("All visible text content on the page"),
          }),
        });
        
        const isRateLimited = visibleContent.includes('Take a quick pause') || 
                             visibleContent.includes('more requests than usual');
        
        const observeResult = await page.observe({
          instruction: instruction || "Find all interactive elements and actions",
        });

        const screenshotUrl = await captureScreenshot(page, url);
        const actionsText = formatActionsToString(observeResult);
        const platformName = detectPlatform(url);

        // Build comprehensive response with visible content and actions
        let responseText = "";
        
        // Add rate limit warning if detected
        if (isRateLimited) {
          responseText += "⚠️ RATE LIMIT DETECTED\n";
          responseText += `${platformName || 'The website'} is limiting automated requests. Try:\n`;
          responseText += "1. Wait a few minutes before trying again\n";
          responseText += "2. Reduce request frequency\n";
          responseText += "3. Add delays between requests\n\n";
        }
        
        if (modalDismissed) {
          responseText += "✅ Login modal detected and dismissed\n\n";
        }
        
        responseText += "📄 VISIBLE PAGE CONTENT:\n";
        responseText += "════════════════════════════════════════\n";
        responseText += visibleContent.trim().slice(0, CONTENT_LIMITS.MAX_VISIBLE_CONTENT_LENGTH);
        if (visibleContent.length > CONTENT_LIMITS.MAX_VISIBLE_CONTENT_LENGTH) {
          responseText += "\n... (content truncated)";
        }
        responseText += "\n\n🎯 AVAILABLE ACTIONS:\n";
        responseText += "════════════════════════════════════════\n";
        responseText += actionsText;

        // Return in the same format as other browser tools for consistent UI
        const result: BrowserObserveResult = {
          success: true,
          message: responseText,
          screenshotUrl: screenshotUrl,
          sessionUrl,
          platformName,
        };
        
        return result;
      });
    } catch (error) {
      const errorResult: BrowserObserveResult = {
        success: false,
        error: `Failed to observe page: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
      
      return errorResult;
    }
  },
});

export default browserObserve;

