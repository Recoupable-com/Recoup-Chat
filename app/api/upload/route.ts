import { NextResponse } from "next/server";
import { Readable } from "node:stream";

// Ensure Node.js has browser-like base64 helpers used by downstream deps (e.g., cosmjs)
function ensureBase64Polyfills() {
  const typedGlobal = globalThis as unknown as {
    atob?: (data: string) => string;
    btoa?: (data: string) => string;
  };
  if (typeof typedGlobal.atob === "undefined") {
    typedGlobal.atob = (data: string) =>
      Buffer.from(data, "base64").toString("binary");
  }
  if (typeof typedGlobal.btoa === "undefined") {
    typedGlobal.btoa = (data: string) =>
      Buffer.from(data, "binary").toString("base64");
  }
}

ensureBase64Polyfills();

if (!process.env.ARWEAVE_KEY) {
  throw new Error("ARWEAVE_KEY environment variable is not set");
}

const ARWEAVE_KEY = JSON.parse(
  Buffer.from(
    process.env.ARWEAVE_KEY.replace("ARWEAVE_KEY=", ""),
    "base64",
  ).toString(),
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    // Lazy-load TurboFactory to ensure polyfills are applied first
    const { TurboFactory } = await import("@ardrive/turbo-sdk");
    const turbo = TurboFactory.authenticated({
      privateKey: ARWEAVE_KEY,
    });

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileSize = fileBuffer.length;

    const [{ winc: fileSizeCost }] = await turbo.getUploadCosts({
      bytes: [fileSize],
    });

    const fileStreamFactory = () => Readable.from(fileBuffer);

    const { id, dataCaches } = await turbo.uploadFile({
      fileStreamFactory,
      fileSizeFactory: () => fileSize,
      dataItemOpts: {
        tags: [
          {
            name: "Content-Type",
            value: file.type || "application/octet-stream",
          },
          {
            name: "File-Name",
            value: file.name,
          },
          {
            name: "App-Name",
            value: "Recoup-Chat",
          },
          {
            name: "Content-Type-Group",
            value: "image",
          },
        ],
      },
    });

    return NextResponse.json({
      success: true,
      id,
      dataCaches,
      cost: fileSizeCost,
      fileName: file.name,
      fileType: file.type,
      fileSize,
      url: `https://arweave.net/${id}`,
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
