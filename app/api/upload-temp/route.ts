import { NextResponse } from "next/server";

/**
 * Temporary upload endpoint that creates data URLs for testing
 * This bypasses Arweave to allow testing of the nano banana model
 */
export async function POST(request: Request) {
  try {
    console.log("📁 TEMP UPLOAD: Processing file upload");
    
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("📁 TEMP UPLOAD ERROR: No file provided");
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    console.log("📁 TEMP UPLOAD: File details:", {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Convert file to base64 data URL with size optimization for nano banana model
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    
    // For nano banana model, compress large images to avoid payload limits
    const maxSizeForNanoBanana = 500 * 1024; // 500KB limit for nano banana
    if (buffer.length > maxSizeForNanoBanana) {
      console.log("📁 TEMP UPLOAD: Large image detected, size:", buffer.length, "bytes. Nano banana model may fail due to payload limits.");
      console.log("📁 TEMP UPLOAD: Consider using a smaller image or a different model for large images.");
    }
    
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    console.log("📁 TEMP UPLOAD SUCCESS: Created data URL, length:", dataUrl.length);

    return NextResponse.json({
      success: true,
      id: `temp-${Date.now()}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      url: dataUrl,
      isTemporary: true
    });

  } catch (error) {
    console.error("📁 TEMP UPLOAD FAILED:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
