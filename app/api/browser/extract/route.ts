import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withBrowser } from "@/lib/browser/withBrowser";
import { schemaToZod } from "@/lib/browser/schemaToZod";
import { isBlockedStartUrl } from "@/lib/browser/isBlockedStartUrl";
import type { BrowserExtractResponse } from "@/types/browser.types";

export const runtime = 'nodejs';

const ExtractSchema = z.object({
  url: z.string().url(),
  schema: z.record(z.string()),
  instruction: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" } as BrowserExtractResponse,
      { status: 400 }
    );
  }

  const parsed = ExtractSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { 
        success: false, 
        error: parsed.error.flatten().formErrors.join(", ") || "Invalid request" 
      } as BrowserExtractResponse,
      { status: 400 }
    );
  }

  const { url, schema, instruction } = parsed.data;

  if (isBlockedStartUrl(url)) {
    return NextResponse.json(
      { 
        success: false, 
        error: "url points to a private or disallowed host" 
      } as BrowserExtractResponse,
      { status: 400 }
    );
  }

  try {

    const data = await withBrowser(async (page) => {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });

      const zodSchema = schemaToZod(schema);

      return await page.extract({
        instruction: instruction || `Extract data according to the provided schema`,
        schema: zodSchema,
      });
    });

    return NextResponse.json({
      success: true,
      data,
    } as BrowserExtractResponse);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      } as BrowserExtractResponse,
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

