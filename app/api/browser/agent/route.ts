import { type NextRequest, NextResponse } from "next/server";
import { withBrowser } from "@/lib/browser/withBrowser";
import type {
  BrowserAgentRequest,
  BrowserAgentResponse,
} from "@/types/browser.types";

export const runtime = 'nodejs';

/**
 * API endpoint for autonomous browser automation
 */
export async function POST(req: NextRequest) {
  try {
    const body: BrowserAgentRequest = await req.json();
    const { startUrl, task } = body;

    if (!startUrl || !task) {
      return NextResponse.json(
        {
          success: false,
          error: "Both 'startUrl' and 'task' are required",
        } as BrowserAgentResponse,
        { status: 400 }
      );
    }

    const result = await withBrowser(async (page) => {
      await page.goto(startUrl, { waitUntil: "domcontentloaded" });
      return await page.act(task);
    });

    return NextResponse.json({
      success: true,
      result: typeof result === "string" ? result : JSON.stringify(result),
    } as BrowserAgentResponse);
  } catch (error) {
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
export const maxDuration = 300;

