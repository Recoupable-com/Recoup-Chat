import { getFileAccessArtists } from "@/lib/supabase/files/getFileAccessArtists";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");
    const accountId = searchParams.get("accountId");

    // Validate required parameters
    if (!fileId || typeof fileId !== "string") {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid fileId",
          message: "File ID is required and must be a string"
        },
        { status: 400 }
      );
    }

    if (!accountId || typeof accountId !== "string") {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid accountId",
          message: "Account ID is required and must be a string"
        },
        { status: 400 }
      );
    }

    const result = await getFileAccessArtists({
      fileId,
      accountId,
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error || "Failed to fetch file access",
          message: result.error || "An error occurred while fetching file access"
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        artists: result.artists,
        count: result.count,
        fileId,
        accountId
      },
      message: result.message || `Found ${result.count} artists with access to this file`
    }, { status: 200 });

  } catch (error) {
    console.error("Error in access-artists API:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred while processing the request"
      },
      { status: 500 }
    );
  }
};
