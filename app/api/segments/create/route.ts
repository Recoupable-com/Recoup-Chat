import { NextRequest, NextResponse } from "next/server";
import { createArtistSegments } from "@/lib/segments/createArtistSegments";

export async function POST(req: NextRequest) {
  try {
    const { artist_account_id, prompt } = await req.json();
    console.log("artist_account_id", artist_account_id);
    console.log("prompt", prompt);
    if (!artist_account_id || !prompt) {
      return NextResponse.json(
        { error: "artist_account_id and prompt are required" },
        { status: 400 }
      );
    }
    const result = await createArtistSegments({ artist_account_id, prompt });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create artist segments",
      },
      { status: 500 }
    );
  }
}
