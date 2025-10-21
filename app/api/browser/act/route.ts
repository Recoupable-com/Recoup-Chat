import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withBrowser } from "@/lib/browser/withBrowser";
import { isBlockedStartUrl } from "@/lib/browser/isBlockedStartUrl";
import type { BrowserActResponse } from "@/types/browser.types";

export const runtime = 'nodejs';

const ActSchema = z.object({
  url: z.string().url(),
  action: z.string().min(1, "action is required"),
});

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" } as BrowserActResponse,
      { status: 400 }
    );
  }

  const parsed = ActSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { 
        success: false, 
        error: parsed.error.flatten().formErrors.join(", ") || "Invalid request" 
      } as BrowserActResponse,
      { status: 400 }
    );
  }

  const { url, action } = parsed.data;

  if (isBlockedStartUrl(url)) {
    return NextResponse.json(
      { 
        success: false, 
        error: "url points to a private or disallowed host" 
      } as BrowserActResponse,
      { status: 400 }
    );
  }

  try {

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

