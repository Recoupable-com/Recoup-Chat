import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withBrowser } from "@/lib/browser/withBrowser";
import { isBlockedStartUrl } from "@/lib/browser/isBlockedStartUrl";
import { browserRouteConfig } from "@/lib/browser/routeConfig";
import type { BrowserAgentResponse } from "@/types/browser.types";

export const runtime = browserRouteConfig.runtime;

// Type guard: Check if value has a boolean success property
function hasBooleanSuccess(x: unknown): x is { success: boolean } {
  return (
    typeof x === "object" && 
    x !== null && 
    "success" in x && 
    typeof (x as { success: unknown }).success === "boolean"
  );
}

const AgentSchema = z.object({
  startUrl: z.string().url().refine((url) => url.startsWith("https://") || url.startsWith("http://"), "startUrl must be http or https"),
  task: z.string().min(1, "task is required"),
});

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" } as BrowserAgentResponse,
      { status: 400 }
    );
  }

  const parsed = AgentSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { 
        success: false, 
        error: parsed.error.flatten().formErrors.join(", ") || "Invalid request" 
      } as BrowserAgentResponse,
      { status: 400 }
    );
  }

  const { startUrl, task } = parsed.data;

  if (isBlockedStartUrl(startUrl)) {
    return NextResponse.json(
      { 
        success: false, 
        error: "startUrl points to a private or disallowed host" 
      } as BrowserAgentResponse,
      { status: 400 }
    );
  }

  // Note: This route is deprecated/simplified - for full multi-step agent, use browser_agent tool directly
  // This route provides a simple HTTP interface for single-action browser automation
  try {
    const result = await withBrowser(async (page) => {
      await page.goto(startUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
      return await page.act(task);
    });

    const success = hasBooleanSuccess(result) ? result.success : true;
    const out = typeof result === "string" ? result : JSON.stringify(result);
    
    return NextResponse.json<BrowserAgentResponse>(
      { success, result: out }, 
      { status: hasBooleanSuccess(result) && !result.success ? 422 : 200 }
    );
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

export const dynamic = browserRouteConfig.dynamic;
export const revalidate = browserRouteConfig.revalidate;
export const fetchCache = browserRouteConfig.fetchCache;
export const maxDuration = browserRouteConfig.maxDuration;

