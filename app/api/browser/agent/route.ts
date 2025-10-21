import { type NextRequest, NextResponse } from "next/server";
import { withBrowser } from "@/lib/browser/withBrowser";
import type {
  BrowserAgentRequest,
  BrowserAgentResponse,
} from "@/types/browser.types";

export const runtime = 'nodejs';

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
      await page.goto(startUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
      return await page.act(task);
    });

    // Check if result is an object with success property, otherwise assume success
    const isObject = typeof result === "object" && result !== null && !Array.isArray(result);
    const hasSuccess = isObject && "success" in result;
    
    const out = typeof result === "string" ? result : JSON.stringify(result);
    
    return NextResponse.json({
      success: hasSuccess ? Boolean((result as any).success) : true,
      result: out,
    } as BrowserAgentResponse, { status: hasSuccess && !(result as any).success ? 422 : 200 });
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

