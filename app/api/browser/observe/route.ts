import { type NextRequest, NextResponse } from "next/server";
import { initStagehand } from "@/lib/browser/initStagehand";
import type {
  BrowserObserveRequest,
  BrowserObserveResponse,
} from "@/types/browser.types";

/**
 * API endpoint for discovering available actions on a web page
 * Uses Stagehand's observe() primitive to identify interactive elements
 */
export async function POST(req: NextRequest) {
  let stagehand;

  try {
    const body: BrowserObserveRequest = await req.json();
    const { url, instruction } = body;

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: "'url' is required",
        } as BrowserObserveResponse,
        { status: 400 }
      );
    }

    // Initialize Stagehand with Browserbase
    stagehand = await initStagehand();
    const page = stagehand.page;

    // Navigate to the URL
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Observe available actions on the page
    const observeResult = await stagehand.observe({
      instruction: instruction || "Find all interactive elements and actions",
    });

    // Close the browser
    await stagehand.close();

    // Format the results as an array of action descriptions
    const actions = Array.isArray(observeResult)
      ? observeResult
      : [observeResult];

    return NextResponse.json({
      success: true,
      actions,
    } as BrowserObserveResponse);
  } catch (error) {
    // Ensure browser is closed on error
    if (stagehand) {
      try {
        await stagehand.close();
      } catch (closeError) {
        console.error("Error closing Stagehand:", closeError);
      }
    }

    console.error("Error in browser observe:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      } as BrowserObserveResponse,
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

