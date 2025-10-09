import { NextResponse } from "next/server";
import { uploadBufferToArweave } from "@/lib/arweave/uploadBase64ToArweave";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("No file provided");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name || `upload-${Date.now()}`;
    const fileType = file.type || "application/octet-stream";

    const result = await uploadBufferToArweave(fileBuffer, fileName, fileType);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
