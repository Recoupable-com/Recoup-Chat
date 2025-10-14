import { type NextRequest, NextResponse } from "next/server";
import { withBrowser } from "@/lib/browser/withBrowser";
import type {
  BrowserObserveRequest,
  BrowserObserveResponse,
} from "@/types/browser.types";

/**
 * API endpoint for discovering available actions on a web page
 */
export async function POST(req: NextRequest) {
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

    const observeResult = await withBrowser(async (page) => {
      await page.goto(url, { waitUntil: "domcontentloaded" });

      return await page.observe({
        instruction: instruction || "Find all interactive elements and actions",
      });
    });

    const actionsArray = Array.isArray(observeResult)
      ? observeResult
      : [observeResult];

    const actions = actionsArray.map(result => 
      typeof result === "string" ? result : JSON.stringify(result)
    );

    return NextResponse.json({
      success: true,
      actions,
    } as BrowserObserveResponse);
  } catch (error) {
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

