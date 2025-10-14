import { type NextRequest, NextResponse } from "next/server";
import { withBrowser } from "@/lib/browser/withBrowser";
import type { BrowserActRequest, BrowserActResponse } from "@/types/browser.types";

/**
 * API endpoint for executing natural language actions on web pages
 */
export async function POST(req: NextRequest) {
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

    await withBrowser(async (page) => {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.act(action);
    });

    return NextResponse.json({
      success: true,
      message: `Successfully executed action: ${action}`,
    } as BrowserActResponse);
  } catch (error) {
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

