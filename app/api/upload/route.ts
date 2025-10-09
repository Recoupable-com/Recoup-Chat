import { NextResponse } from "next/server";
import { Readable } from "node:stream";
import { uploadFileByKey } from "@/lib/supabase/storage/uploadFileByKey";
import { createSignedUrlForKey } from "@/lib/supabase/storage/createSignedUrl";
import { generateUUID } from "@/lib/generateUUID";

// Ensure Node.js has browser-like base64 helpers used by downstream deps (e.g., cosmjs)
function ensureBase64Polyfills() {
  const atobImpl = (data: string) => Buffer.from(data, "base64").toString("binary");
  const btoaImpl = (data: string) => Buffer.from(data, "binary").toString("base64");

  // Apply to globalThis and global objects
  const globals = [globalThis, global].filter(Boolean);
  
  globals.forEach((g) => {
    if (typeof (g as typeof globalThis & { atob?: unknown }).atob === "undefined") {
      (g as typeof globalThis & { atob: (data: string) => string }).atob = atobImpl;
    }
    if (typeof (g as typeof globalThis & { btoa?: unknown }).btoa === "undefined") {
      (g as typeof globalThis & { btoa: (data: string) => string }).btoa = btoaImpl;
    }
  });

  // Also ensure they're available as direct properties
  if (typeof (globalThis as typeof globalThis & { atob?: unknown }).atob === "undefined") {
    (globalThis as typeof globalThis & { atob: (data: string) => string }).atob = atobImpl;
  }
  if (typeof (globalThis as typeof globalThis & { btoa?: unknown }).btoa === "undefined") {
    (globalThis as typeof globalThis & { btoa: (data: string) => string }).btoa = btoaImpl;
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

// Fallback to Supabase storage when Arweave fails
async function uploadToSupabase(file: File) {
  const fileExtension = file.name.split('.').pop() || '';
  const uniqueId = generateUUID();
  const timestamp = new Date().toISOString().split('T')[0];
  const storageKey = `uploads/chat-attachments/${timestamp}/${uniqueId}.${fileExtension}`;
  
  await uploadFileByKey(storageKey, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  
  const signedUrl = await createSignedUrlForKey(storageKey, 365 * 24 * 60 * 60); // 1 year
  
  return {
    success: true,
    id: uniqueId,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    url: signedUrl,
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    // Try Arweave first, fallback to Supabase if it fails
    try {
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
    } catch (arweaveError) {
      console.warn("Arweave upload failed, trying Supabase fallback:", arweaveError);
      const result = await uploadToSupabase(file);
      return NextResponse.json(result);
    }
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
