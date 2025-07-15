import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artistAccountId = searchParams.get("artist_account_id");

  if (!artistAccountId) {
    return NextResponse.json(
      { error: "Artist account ID is required" },
      { status: 400 }
    );
  }

  try {
    const validationResult = await validateYouTubeTokens(artistAccountId);

    if (validationResult.success) {
      return NextResponse.json({
        status: "valid",
        artistAccountId,
      });
    } else {
      return NextResponse.json({
        status: "invalid",
        artistAccountId,
        error: validationResult.error?.message || "Token validation failed",
      });
    }
  } catch (error) {
    console.error("Error checking YouTube token status:", error);
    return NextResponse.json(
      {
        status: "error",
        artistAccountId,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
