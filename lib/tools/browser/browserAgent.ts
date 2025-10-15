import { z } from "zod";
import { tool } from "ai";
import { initStagehand } from "@/lib/browser/initStagehand";
import { captureScreenshot } from "@/lib/browser/captureScreenshot";
import { detectPlatform } from "@/lib/browser/detectPlatform";

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
  execute: async function* ({ startUrl, task }) {
    const { stagehand, liveViewUrl, sessionUrl } = await initStagehand();
    
    try {
      // Yield initial status with LIVE browser link IMMEDIATELY
      yield {
        status: 'initializing',
        message: liveViewUrl 
          ? `🎥 **WATCH LIVE:** ${liveViewUrl}\n\n🤖 Initializing autonomous agent...\n\n💡 Click the link above to watch AI control the browser in real-time!`
          : 'Initializing autonomous agent...',
        liveViewUrl,
        sessionUrl,
      };

      const agent = stagehand.agent({
        provider: "google",
        model: "gemini-2.5-computer-use-preview-10-2025",
        instructions: "You are a helpful assistant that can use a web browser to complete tasks.",
        options: {
          apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY,
        },
      });

      yield {
        status: 'navigating',
        message: `Navigating to ${startUrl}...\n\n🎥 **WATCH LIVE:** ${liveViewUrl || sessionUrl}`,
        liveViewUrl,
        sessionUrl,
      };

      await stagehand.page.goto(startUrl, { waitUntil: "domcontentloaded" });

      yield {
        status: 'executing',
        message: `🤖 Agent is working autonomously...\n\n**Task:** ${task}\n\n🎥 **WATCH LIVE:** ${liveViewUrl || sessionUrl}\n\n💡 Watch the AI click, type, and navigate the browser above!`,
        liveViewUrl,
        sessionUrl,
      };

      const result = await agent.execute({
        instruction: task,
        maxSteps: 20,
        autoScreenshot: true,
      });

      const screenshotUrl = await captureScreenshot(stagehand.page, startUrl);

      const resultText = typeof result === "string" ? result : JSON.stringify(result);
      const platformName = detectPlatform(startUrl);

      await stagehand.close();

      return {
        success: true,
        message: resultText,
        screenshotUrl,
        sessionUrl,
        platformName,
      };
    } catch (error) {
      console.error('[browser_agent] EXECUTION FAILED');
      console.error('[browser_agent] Error:', error);
      console.error('[browser_agent] Error message:', error instanceof Error ? error.message : 'Unknown');
      console.error('[browser_agent] Error stack:', error instanceof Error ? error.stack : 'No stack');
      console.error('[browser_agent] Error details:', JSON.stringify(error, null, 2));
      
      try {
        await stagehand.close();
        console.log('[browser_agent] Stagehand closed after error');
      } catch (closeError) {
        console.error('[browser_agent] Failed to close Stagehand:', closeError);
      }

      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      return {
        success: false,
        error: `${errorMessage}\n\nCheck server logs for details.`,
      };
    }
  },
});

export default browserAgent;

