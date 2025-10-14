import { z } from "zod";
import { tool } from "ai";
import { withBrowser } from "@/lib/browser/withBrowser";
import { captureScreenshot } from "@/lib/browser/captureScreenshot";

/**
 * Browser Observe Tool
 * Discovers available actions and interactive elements on web pages
 */
const browserObserve = tool({
  description: `Discover what actions are possible on a webpage.

Use this tool to explore a webpage and identify interactive elements like:
- Buttons and links
- Form fields
- Navigation elements
- Clickable areas

This is useful for:
- Understanding page structure before performing actions
- Finding specific elements to interact with
- Debugging why an action might not be working

You can provide an optional instruction to focus the observation (e.g., "find all form fields").`,
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

