import { type NextRequest, NextResponse } from "next/server";
import { initStagehand } from "@/lib/browser/initStagehand";
import type { BrowserActRequest, BrowserActResponse } from "@/types/browser.types";

/**
 * API endpoint for executing natural language actions on web pages
 * Uses Stagehand's act() primitive to perform actions like clicking, typing, etc.
 */
export async function POST(req: NextRequest) {
  let stagehand;

  try {
    const body: BrowserActRequest = await req.json();
    const { url, action } = body;

    if (!url || !action) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          error: "Both 'url' and 'action' are required",
        } as BrowserActResponse,
        { status: 400 }
      );
    }

    // Initialize Stagehand with Browserbase
    stagehand = await initStagehand();
    const page = stagehand.page;

    // Navigate to the URL
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Execute the action using natural language
    await stagehand.act({ action });

    // Close the browser
    await stagehand.close();

    return NextResponse.json({
      success: true,
      message: `Successfully executed action: ${action}`,
    } as BrowserActResponse);
  } catch (error) {
    // Ensure browser is closed on error
    if (stagehand) {
      try {
        await stagehand.close();
      } catch (closeError) {
        console.error("Error closing Stagehand:", closeError);
      }
    }

    console.error("Error in browser act:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to execute browser action",
        error: error instanceof Error ? error.message : "Unknown error",
      } as BrowserActResponse,
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

