import { NextRequest } from "next/server";
import { generateAndProcessImage } from "@/lib/generateAndProcessImage";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  try {
    const prompt = request.nextUrl.searchParams.get("prompt");

    if (!prompt) {
      return Response.json(
        { error: "Query parameter 'prompt' is required." },
        { status: 400 }
      );
    }

    const result = await generateAndProcessImage(prompt);

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Error generating image:", error);

    return Response.json(
      {
        error: "Failed to generate image.",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
