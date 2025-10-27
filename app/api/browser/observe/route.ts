import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withBrowser } from "@/lib/browser/withBrowser";
import { isBlockedStartUrl } from "@/lib/browser/isBlockedStartUrl";
import type { BrowserObserveResponse } from "@/types/browser.types";

export const runtime = 'nodejs';

const ObserveSchema = z.object({
  url: z.string().url(),
  instruction: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" } as BrowserObserveResponse,
      { status: 400 }
    );
  }

  const parsed = ObserveSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { 
        success: false, 
        error: parsed.error.flatten().formErrors.join(", ") || "Invalid request" 
      } as BrowserObserveResponse,
      { status: 400 }
    );
  }

  const { url, instruction } = parsed.data;

  if (isBlockedStartUrl(url)) {
    return NextResponse.json(
      { 
        success: false, 
        error: "url points to a private or disallowed host" 
      } as BrowserObserveResponse,
      { status: 400 }
    );
  }

  try {

    const observeResult = await withBrowser(async (page) => {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });

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

