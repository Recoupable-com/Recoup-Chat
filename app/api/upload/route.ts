import { NextResponse } from "next/server";
import { Readable } from "node:stream";

// Ensure Node.js has browser-like base64 helpers used by downstream deps (e.g., cosmjs)
// Apply polyfills IMMEDIATELY and to all possible global objects
function ensureBase64Polyfills() {
  const atobImpl = (data: string) => Buffer.from(data, "base64").toString("binary");
  const btoaImpl = (data: string) => Buffer.from(data, "binary").toString("base64");

  // Apply to all possible global contexts
  const globals = [globalThis, global, window].filter(Boolean);
  
  globals.forEach((g: any) => {
    if (typeof g.atob === "undefined") {
      g.atob = atobImpl;
    }
    if (typeof g.btoa === "undefined") {
      g.btoa = btoaImpl;
    }
  });

  // Also ensure they're available as direct properties
  if (typeof (globalThis as any).atob === "undefined") {
    (globalThis as any).atob = atobImpl;
  }
  if (typeof (globalThis as any).btoa === "undefined") {
    (globalThis as any).btoa = btoaImpl;
  }

  console.log("📁 POLYFILL DEBUG: Base64 polyfills applied", {
    atobExists: typeof (globalThis as any).atob !== "undefined",
    btoaExists: typeof (globalThis as any).btoa !== "undefined"
  });
}

ensureBase64Polyfills();

if (!process.env.ARWEAVE_KEY) {
  console.error("📁 ENV ERROR: ARWEAVE_KEY environment variable is not set");
  throw new Error("ARWEAVE_KEY environment variable is not set");
}

console.log("📁 ENV DEBUG: ARWEAVE_KEY found, length:", process.env.ARWEAVE_KEY.length);

const ARWEAVE_KEY = JSON.parse(
  Buffer.from(
    process.env.ARWEAVE_KEY.replace("ARWEAVE_KEY=", ""),
    "base64",
  ).toString(),
);

console.log("📁 ENV DEBUG: ARWEAVE_KEY parsed successfully");

export async function POST(request: Request) {
  try {
    console.log("📁 UPLOAD DEBUG: Upload request received");
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("📁 UPLOAD ERROR: No file provided in form data");
      throw new Error("No file provided");
    }

    console.log("📁 UPLOAD DEBUG: File details:", {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Lazy-load TurboFactory to ensure polyfills are applied first
    console.log("📁 UPLOAD DEBUG: Loading TurboFactory...");
    const { TurboFactory } = await import("@ardrive/turbo-sdk");
    
    console.log("📁 UPLOAD DEBUG: Authenticating with Arweave...");
    const turbo = TurboFactory.authenticated({
      privateKey: ARWEAVE_KEY,
    });
    console.log("📁 UPLOAD DEBUG: Turbo client created successfully");

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
    console.error("📁 UPLOAD FAILED:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
