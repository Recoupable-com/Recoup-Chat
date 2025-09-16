import { revokeFileAccess } from "@/lib/supabase/files/revokeFileAccess";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: NextRequest) => {
  try {
    const { fileId, artistId } = await req.json();

    if (!fileId || typeof fileId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid fileId" },
        { status: 400 }
      );
    }

    if (!artistId || typeof artistId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid artistId" },
        { status: 400 }
      );
    }

    const result = await revokeFileAccess({ fileId, artistId });
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to revoke access" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in revoke-access API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};


