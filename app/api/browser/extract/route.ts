import { type NextRequest, NextResponse } from "next/server";
import { initStagehand, schemaToZod } from "@/lib/browser/initStagehand";
import type {
  BrowserExtractRequest,
  BrowserExtractResponse,
} from "@/types/browser.types";

/**
 * API endpoint for extracting structured data from web pages
 * Uses Stagehand's extract() primitive with Zod schemas
 */
export async function POST(req: NextRequest) {
  let stagehand;

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

    // Initialize Stagehand with Browserbase
    stagehand = await initStagehand();
    const page = stagehand.page;

    // Navigate to the URL
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Convert the plain schema object to a Zod schema
    const zodSchema = schemaToZod(schema);

    // Extract data using the schema
    const extractResult = await stagehand.extract({
      instruction: instruction || `Extract data according to the provided schema`,
      schema: zodSchema,
    });

    // Close the browser
    await stagehand.close();

    return NextResponse.json({
      success: true,
      data: extractResult,
    } as BrowserExtractResponse);
  } catch (error) {
    // Ensure browser is closed on error
    if (stagehand) {
      try {
        await stagehand.close();
      } catch (closeError) {
        console.error("Error closing Stagehand:", closeError);
      }
    }

    console.error("Error in browser extract:", error);
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

