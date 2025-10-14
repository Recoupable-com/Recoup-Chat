import { type NextRequest, NextResponse } from "next/server";
import { initStagehand } from "@/lib/browser/initStagehand";
import type {
  BrowserAgentRequest,
  BrowserAgentResponse,
} from "@/types/browser.types";

/**
 * API endpoint for autonomous browser automation using Stagehand Agent
 * Executes multi-step workflows using natural language instructions
 */
export async function POST(req: NextRequest) {
  let stagehand;

  try {
    const body: BrowserAgentRequest = await req.json();
    const { startUrl, task, model } = body;

    if (!startUrl || !task) {
      return NextResponse.json(
        {
          success: false,
          error: "Both 'startUrl' and 'task' are required",
        } as BrowserAgentResponse,
        { status: 400 }
      );
    }

    // Initialize Stagehand with Browserbase
    stagehand = await initStagehand();
    const page = stagehand.page;

    // Navigate to the starting URL
    await page.goto(startUrl, { waitUntil: "domcontentloaded" });

    // Create an agent with specified model (defaults to Claude Sonnet 4)
    const agent = stagehand.agent({
      provider: "anthropic",
      model: model || "claude-sonnet-4-20250514",
      options: {
        apiKey: process.env.ANTHROPIC_API_KEY,
      },
    });

    // Execute the task autonomously
    const result = await agent.execute(task);

    // Close the browser
    await stagehand.close();

    return NextResponse.json({
      success: true,
      result: typeof result === "string" ? result : JSON.stringify(result),
    } as BrowserAgentResponse);
  } catch (error) {
    // Ensure browser is closed on error
    if (stagehand) {
      try {
        await stagehand.close();
      } catch (closeError) {
        console.error("Error closing Stagehand:", closeError);
      }
    }

    console.error("Error in browser agent:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      } as BrowserAgentResponse,
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const maxDuration = 300; // 5 minutes for complex agent tasks

