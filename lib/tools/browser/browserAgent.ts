import { z } from "zod";
import { tool } from "ai";
import { initStagehand } from "@/lib/browser/initStagehand";
import { captureScreenshot } from "@/lib/browser/captureScreenshot";
import { detectPlatform } from "@/lib/browser/detectPlatform";
import { normalizeInstagramUrl } from "@/lib/browser/normalizeInstagramUrl";
import { BROWSER_AGENT_CONFIG } from "@/lib/browser/constants";

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
        "AI model to use for the agent (defaults to gemini-2.5-computer-use-preview-10-2025)"
      ),
  }),
  execute: async function* ({ startUrl, task, model }) {
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

      const chosenModel = model ?? BROWSER_AGENT_CONFIG.DEFAULT_MODEL;

      const agent = stagehand.agent({
        provider: "google",
        model: chosenModel,
        instructions: "You are a helpful assistant that can use a web browser to complete tasks.",
        options: {
          apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY,
        },
      });

      const targetUrl = normalizeInstagramUrl(startUrl);

      yield {
        status: 'navigating',
        message: `Navigating to ${targetUrl}...\n\n🎥 **WATCH LIVE:** ${liveViewUrl || sessionUrl}`,
        liveViewUrl,
        sessionUrl,
      };

      await stagehand.page.goto(targetUrl, { waitUntil: "domcontentloaded" });

      yield {
        status: 'executing',
        message: `🤖 Agent is working autonomously...\n\n**Task:** ${task}\n\n🎥 **WATCH LIVE:** ${liveViewUrl || sessionUrl}\n\n💡 Watch the AI click, type, and navigate the browser above!`,
        liveViewUrl,
        sessionUrl,
      };

      const result = await agent.execute({
        instruction: task,
        maxSteps: BROWSER_AGENT_CONFIG.MAX_STEPS,
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
      console.error('[browser_agent] Browser agent error:', error);
      
      try {
        await stagehand.close();
      } catch (closeError) {
        console.error('[browser_agent] Failed to close stagehand:', closeError);
      }

      const errorMessage = error instanceof Error ? error.message : String(error);

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
});

export default browserAgent;

