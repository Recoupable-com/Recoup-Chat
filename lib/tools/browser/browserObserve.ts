import { z } from "zod";
import { tool } from "ai";
import { withBrowser } from "@/lib/browser/withBrowser";
import { captureScreenshot } from "@/lib/browser/captureScreenshot";
import { detectPlatform } from "@/lib/browser/detectPlatform";

export interface BrowserObserveResult {
  success: boolean;
  message?: string;
  screenshotUrl?: string;
  sessionUrl?: string;
  platformName?: string;
  error?: string;
}

const browserObserve = tool({
  description: `Observe and VIEW web pages like a human - automatically dismisses login modals and extracts all visible content.

WHEN TO USE THIS TOOL:
✓ To see ALL visible text on a page (follower counts, bios, stats, prices)
✓ Social media profiles with login walls (Instagram, TikTok, Twitter, YouTube)
✓ Quick data viewing without defining a schema
✓ When you need to get past login popups automatically
✓ BEST CHOICE for scraping public social media profiles

KEY CAPABILITY - AUTOMATIC LOGIN BYPASS:
• Automatically detects and dismisses login modals/popups
• Waits for page to load completely before extraction
• Returns ALL visible text from the page (up to 3000 characters)
• Takes a screenshot for visual confirmation
• Works on public profiles even with aggressive login overlays
• Extracts follower counts, bios, posts without authentication
• Instagram, TikTok, Twitter, YouTube, Facebook profiles all work
• Also discovers interactive elements (buttons, links)

HOW IT WORKS:
1. Loads the page and waits for content to render
2. Automatically detects and closes login popups
3. Extracts all visible text content
4. Takes a screenshot
5. Returns everything to you

WHAT YOU GET:
1. Full visible page text (follower counts, usernames, bios, stats, dates)
2. A screenshot of the page after modal dismissal
3. Available interactive actions (if needed)
4. Browser session recording link
5. Confirmation if a modal was dismissed

USE THIS WHEN:
✓ "Get follower count from Instagram/TikTok/Twitter profile"
✓ "Read all visible stats from this YouTube channel"
✓ "What's on this social media page?"
✓ "Extract profile information from [any public profile]"

VS browser_extract:
- browser_observe: Automatic modal dismissal, reads ALL text, no schema needed
- browser_extract: Requires schema, may fail on login walls, needs structured data

This tool handles login modals automatically - just give it a URL and it will get past the popup.`,
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
        // Convert to mobile URL if it's Instagram (less aggressive rate limiting)
        let targetUrl = url;
        if (url.includes('instagram.com') && !url.includes('https://www.instagram.com')) {
          targetUrl = url.replace('instagram.com', 'www.instagram.com');
        }
        
        console.log('[browser_observe] Navigating to:', targetUrl);
        await page.goto(targetUrl, { waitUntil: "domcontentloaded" });

        console.log('[browser_observe] Page loaded, waiting for content to render...');
        
        // Wait longer for initial page load - seem more human
        await page.waitForTimeout(3000);

        // Add human-like behavior: scroll down slightly
        try {
          console.log('[browser_observe] Simulating human behavior: scrolling...');
          await page.evaluate(() => {
            window.scrollTo({ top: 300, behavior: 'smooth' });
          });
          await page.waitForTimeout(1500);
          
          // Scroll back up
          await page.evaluate(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
          await page.waitForTimeout(1000);
        } catch (scrollError) {
          console.log('[browser_observe] Scrolling behavior skipped:', scrollError);
        }

        // Attempt to automatically dismiss common login modals
        let modalDismissed = false;
        try {
          console.log('[browser_observe] Attempting to dismiss login modals...');
          
          // Try to dismiss modal using the same method as browserAct
          await page.act("close the login popup");
          
          modalDismissed = true;
          console.log('[browser_observe] Successfully dismissed login modal');
          
          // Wait longer for modal to close and content to be visible
          await page.waitForTimeout(2000);
        } catch (modalError) {
          console.log('[browser_observe] No login modal found or could not dismiss:', 
            modalError instanceof Error ? modalError.message : 'Unknown error');
          // Continue anyway - maybe there was no modal
        }

        console.log('[browser_observe] Extracting page content using AI-powered extraction...');
        
        const { visibleContent } = await page.extract({
          instruction: "Extract all visible text content from the page including follower counts, bios, and stats",
          schema: z.object({
            visibleContent: z.string().describe("All visible text content on the page"),
          }),
        });
        
        console.log('[browser_observe] Page content extracted, length:', visibleContent.length);
        
        const isRateLimited = visibleContent.includes('Take a quick pause') || 
                             visibleContent.includes('more requests than usual');
        
        if (isRateLimited) {
          console.warn('[browser_observe] ⚠️ Instagram rate limit detected! Trying to extract data anyway...');
        }

        console.log('[browser_observe] Running observe to find interactive elements...');
        
        const observeResult = await page.observe({
          instruction: instruction || "Find all interactive elements and actions",
        });
        
        console.log('[browser_observe] Observe complete, capturing screenshot...');

        const screenshotUrl = await captureScreenshot(page, url);
        
        console.log('[browser_observe] Screenshot captured:', screenshotUrl ? 'success' : 'failed');

        const actions = Array.isArray(observeResult)
          ? observeResult
          : [observeResult];

        const actionsText = actions.length > 0
          ? actions.join("\n- ")
          : "No specific actions identified";

        // Build comprehensive response with visible content and actions
        let responseText = "";
        
        // Add rate limit warning if detected
        if (isRateLimited) {
          responseText += "⚠️ INSTAGRAM RATE LIMIT DETECTED\n";
          responseText += "Instagram is blocking automated requests. Try:\n";
          responseText += "1. Wait 5-10 minutes before trying again\n";
          responseText += "2. Use fewer requests at once (one profile at a time)\n";
          responseText += "3. Add delays between requests\n\n";
        }
        
        if (modalDismissed) {
          responseText += "✅ Login modal detected and dismissed\n\n";
        }
        
        responseText += "📄 VISIBLE PAGE CONTENT:\n";
        responseText += "════════════════════════════════════════\n";
        responseText += visibleContent.trim().slice(0, 3000);
        if (visibleContent.length > 3000) {
          responseText += "\n... (content truncated)";
        }
        responseText += "\n\n🎯 AVAILABLE ACTIONS:\n";
        responseText += "════════════════════════════════════════\n";
        responseText += `- ${actionsText}`;

        // Detect platform from URL using the same helper as other browser tools
        const platformName = detectPlatform(url);
        
        console.log('[browser_observe] Building result for platform:', platformName);

        // Return in the same format as other browser tools for consistent UI
        const result: BrowserObserveResult = {
          success: true,
          message: responseText,
          screenshotUrl: screenshotUrl,
          sessionUrl,
          platformName,
        };
        
        console.log('[browser_observe] Returning successful result');
        return result;
      });
    } catch (error) {
      console.error('[browser_observe] Tool execution failed:', error);
      console.error('[browser_observe] Error stack:', error instanceof Error ? error.stack : 'No stack');
      
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

