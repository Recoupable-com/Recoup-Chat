import { z } from "zod";
import { tool } from "ai";
import { initStagehand } from "@/lib/browser/initStagehand";
import { uploadScreenshot } from "@/lib/browser/uploadScreenshot";

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
    let stagehandInstance;

    try {
      console.log(`[browserObserve] Starting - URL: ${url}`);
      console.log(`[browserObserve] Instruction: ${instruction || "default"}`);
      
      // Initialize Stagehand with Browserbase
      const { stagehand, sessionUrl } = await initStagehand();
      stagehandInstance = stagehand;
      const page = stagehand.page;

      console.log(`[browserObserve] Navigating to ${url}...`);
      // Navigate to the URL
      await page.goto(url, { waitUntil: "domcontentloaded" });

      console.log(`[browserObserve] Observing page...`);
      // Observe available actions on the page
      const observeResult = await page.observe({
        instruction: instruction || "Find all interactive elements and actions",
      });

      console.log(`[browserObserve] Observation completed`);

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

      // Format the results as an array of action descriptions
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

      // Add screenshot as image URL if upload succeeded
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
    } catch (error) {
      console.error("[browserObserve] Error:", error);
      
      // Ensure browser is closed on error
      if (stagehandInstance) {
        try {
          await stagehandInstance.close();
        } catch (closeError) {
          console.error("[browserObserve] Error closing Stagehand:", closeError);
        }
      }

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

