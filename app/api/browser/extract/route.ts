import { type NextRequest, NextResponse } from "next/server";
import { withBrowser } from "@/lib/browser/withBrowser";
import { schemaToZod } from "@/lib/browser/schemaToZod";
import type {
  BrowserExtractRequest,
  BrowserExtractResponse,
} from "@/types/browser.types";

/**
 * API endpoint for extracting structured data from web pages
 */
export async function POST(req: NextRequest) {
  try {
    const body: BrowserExtractRequest = await req.json();
    const { url, schema, instruction } = body;

    if (!url || !schema) {
      return NextResponse.json(
        {
          success: false,
          error: "Both 'url' and 'schema' are required",
        } as BrowserExtractResponse,
        { status: 400 }
      );
    }

    const data = await withBrowser(async (page) => {
      await page.goto(url, { waitUntil: "domcontentloaded" });

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

