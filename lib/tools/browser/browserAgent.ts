import { z } from "zod";
import { tool } from "ai";
import { initStagehand } from "@/lib/browser/initStagehand";
import { captureScreenshot } from "@/lib/browser/captureScreenshot";
import { detectPlatform } from "@/lib/browser/detectPlatform";
import { normalizeInstagramUrl } from "@/lib/browser/normalizeInstagramUrl";
import { BROWSER_AGENT_CONFIG } from "@/lib/browser/constants";

const browserAgent = tool({
  description: `**USE WHEN:** User requests MULTI-STEP tasks, uses "and then" phrasing, or asks to "navigate", "find", "research", or "explore" requiring multiple actions.

Autonomous browser agent that performs complex workflows. Can click, navigate, extract, and reason through multi-step tasks.

TRIGGER WORDS that indicate this tool:
- "and then", "after that", "navigate to", "go to [X] and [Y]"
- "find", "search for", "look for", "locate", "discover"
- "research", "investigate", "explore", "browse through"
- "summarize", "compare", "analyze" (requires gathering data first)

EXAMPLES that should use browser_agent:
✓ "Go to fatbeats.com and find their Instagram handle"
✓ "Navigate to the About page and tell me about the company"
✓ "Visit their site and find contact information"
✓ "Click into the products section and tell me what's featured"
✓ "Research pricing on this site and create a summary"

DO NOT USE for single-step actions or viewing:
✗ "What's on this page" → use browser_observe
✗ "Click the About link" → use browser_act
✗ "Extract follower count" → use browser_extract

NOTE: Takes longer than other tools (performs up to 20 autonomous steps).`,
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

