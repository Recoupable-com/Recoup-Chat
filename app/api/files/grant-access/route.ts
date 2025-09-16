import { grantFileAccess } from "@/lib/supabase/files/grantFileAccess";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: NextRequest) => {
  try {
    const { selected, fileId, grantedBy, scope } = await req.json();

    // Validate required fields
    if (!selected || !Array.isArray(selected) || selected.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "No selected artists provided or invalid format",
          message: "Please select at least one artist to grant access to"
        },
        { status: 400 }
      );
    }

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

    if (!grantedBy || typeof grantedBy !== "string") {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid grantedBy",
          message: "Granted by user ID is required and must be a string"
        },
        { status: 400 }
      );
    }

    // Validate scope if provided
    if (scope && !["read_only", "admin"].includes(scope)) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid scope",
          message: "Scope must be either 'read_only' or 'admin'"
        },
        { status: 400 }
      );
    }

    const result = await grantFileAccess({
      fileId,
      artistIds: selected,
      grantedBy,
      scope,
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error || "Failed to grant access",
          message: result.error || "An error occurred while granting file access"
        },
        { status: 400 }
      );
    }

    // Return detailed results
    return NextResponse.json({
      success: true,
      message: "File access granted successfully",
      results: result.results,
      summary: {
        total: selected.length,
        successful: result.results?.successful.length || 0,
        alreadyExists: result.results?.alreadyExists.length || 0,
        failed: result.results?.failed.length || 0,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error in grant-access API:", error);
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
