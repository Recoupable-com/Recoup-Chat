import { z } from "zod";
import { tool } from "ai";
import { initStagehand } from "@/lib/browser/initStagehand";
import { captureScreenshot } from "@/lib/browser/captureScreenshot";

const browserAgent = tool({
  description: `Automate entire workflows on websites autonomously using natural language.

This is the most powerful browser tool - it can perform complex multi-step tasks on its own.

Use this for tasks that require multiple actions, such as:
- "Research competitor pricing and create a summary"
- "Fill out this job application form with my information"
- "Scrape all product listings from this page and subpages"
- "Navigate to the settings page and enable dark mode"

The agent will autonomously determine what steps to take, which buttons to click, what information to extract, etc.

Note: This tool may take longer to execute as it performs multiple operations.`,
  inputSchema: z.object({
    startUrl: z
      .string()
      .url()
      .describe("The URL where the agent should start the task"),
    task: z
      .string()
      .describe(
        "Natural language description of the complete workflow to execute (e.g., 'search for laptops under $1000 and extract the top 5 results')"
      ),
    model: z
      .string()
      .optional()
      .describe(
        "AI model to use for the agent (defaults to claude-sonnet-4-20250514)"
      ),
  }),
  execute: async ({ startUrl, task }) => {
    const { stagehand, sessionUrl } = await initStagehand();
    
    try {
      const agent = stagehand.agent({
        provider: "anthropic",
        model: "claude-sonnet-4-20250514",
        instructions: "You are a helpful assistant that can use a web browser to complete tasks.",
        options: {
          apiKey: process.env.ANTHROPIC_API_KEY,
        },
      });

      await stagehand.page.goto(startUrl, { waitUntil: "domcontentloaded" });

      const result = await agent.execute({
        instruction: task,
        maxSteps: 20,
        autoScreenshot: true,
      });

      const screenshotUrl = await captureScreenshot(stagehand.page, startUrl);

      const resultText = typeof result === "string" ? result : JSON.stringify(result);
      const responseText = sessionUrl
        ? `Agent completed the task:\n\n${resultText}\n\n🎥 [View Browser Recording](${sessionUrl})`
        : `Agent completed the task:\n\n${resultText}`;

      const content: Array<{ type: string; text?: string; image?: string }> = [
        { type: "text", text: responseText }
      ];

      if (screenshotUrl) {
        content.push({
          type: "image",
          image: screenshotUrl,
        });
      }

      await stagehand.close();

      return {
        content,
        isError: false,
      };
    } catch (error) {
      try {
        await stagehand.close();
      } catch {
        // Cleanup failed
      }

      return {
        content: [
          {
            type: "text",
            text: `Failed to execute agent task: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
        isError: true,
      };
    }
  },
});

export default browserAgent;

