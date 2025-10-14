import { z } from "zod";
import { tool } from "ai";
import { withBrowser } from "@/lib/browser/withBrowser";
import { captureScreenshot } from "@/lib/browser/captureScreenshot";

/**
 * Browser Observe Tool
 * Discovers available actions and interactive elements on web pages
 */
const browserObserve = tool({
  description: `Observe and analyze web pages like a human would - sees content even behind login popups.

WHEN TO USE THIS TOOL:
✓ Before extracting data - to understand what's on the page
✓ Finding interactive elements (buttons, forms, links)
✓ Checking if data is visible despite login walls
✓ Understanding page structure and available actions
✓ BEST for social media profiles with login overlays

KEY CAPABILITY - SEES LIKE A HUMAN:
• This tool can VIEW content that's rendered on the page
• Works on public profiles even with login popups
• Instagram, TikTok, Twitter profiles are visible
• The login popup is an overlay - content is underneath
• Can see follower counts, bios, posts without authentication

WHAT IT DISCOVERS:
• Interactive elements (buttons, links, forms)
• Visible text and data on the page
• Navigation options
• Available actions you can take with browser_act
• Whether login is truly required or just a popup

USE CASES:
✓ "Observe Instagram profile - can you see follower count?"
✓ "Check what's visible on this TikTok page"
✓ "Find the close button on the login popup"
✓ "What data can be extracted from this page?"

WORKFLOW:
1. Use browser_observe to see what's visible
2. If login popup exists, use browser_act to dismiss it
3. Use browser_extract to get the specific data

This tool is particularly effective for social media scraping where data is public but a login popup appears.`,
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
      return await withBrowser(async (page, sessionUrl) => {
        await page.goto(url, { waitUntil: "domcontentloaded" });

        const observeResult = await page.observe({
          instruction: instruction || "Find all interactive elements and actions",
        });

        const screenshotUrl = await captureScreenshot(page, url);

        const actions = Array.isArray(observeResult)
          ? observeResult
          : [observeResult];

        const actionsText = actions.length > 0
          ? actions.join("\n- ")
          : "No specific actions identified";

        const responseText = sessionUrl
          ? `Available actions on the page:\n- ${actionsText}\n\n🎥 [View Browser Recording](${sessionUrl})`
          : `Available actions on the page:\n- ${actionsText}`;

        const content: Array<{ type: string; text?: string; image?: string }> = [
          { type: "text", text: responseText }
        ];

        if (screenshotUrl) {
          content.push({
            type: "image",
            image: screenshotUrl,
          });
        }

        return {
          content,
          isError: false,
        };
      });
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to observe page: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
        isError: true,
      };
    }
  },
});

export default browserObserve;

