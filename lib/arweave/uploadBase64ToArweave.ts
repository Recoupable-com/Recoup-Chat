import { Readable } from "node:stream";

// Type declarations for global base64 helpers to satisfy TypeScript
declare global {
  // eslint-disable-next-line no-var
  var atob: ((data: string) => string) | undefined;
  // eslint-disable-next-line no-var
  var btoa: ((data: string) => string) | undefined;
}

// Ensure Node.js has browser-like base64 helpers used by downstream deps (e.g., cosmjs)
// This must run before importing packages that expect global atob/btoa.
function ensureBase64Polyfills() {
  if (typeof globalThis.atob === "undefined") {
    // Decode base64 → binary string
    // Note: Buffer is Node-only; safe on the server
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).atob = (data: string) =>
      Buffer.from(data, "base64").toString("binary");
  }
  if (typeof globalThis.btoa === "undefined") {
    // Encode binary string → base64
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).btoa = (data: string) =>
      Buffer.from(data, "binary").toString("base64");
  }
}

ensureBase64Polyfills();

// Load and parse the Arweave key
if (!process.env.ARWEAVE_KEY) {
  throw new Error("ARWEAVE_KEY environment variable is not set");
}

const ARWEAVE_KEY = JSON.parse(
  Buffer.from(
    process.env.ARWEAVE_KEY.replace("ARWEAVE_KEY=", ""),
    "base64"
  ).toString()
);

export type ArweaveUploadResult = {
  id: string;
  dataCaches: string[];
  cost: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
};

/**
 * Upload a buffer to Arweave
 */
async function uploadBufferToArweave(
  fileBuffer: Buffer,
  fileName: string,
  fileType: string
): Promise<ArweaveUploadResult> {
  // Lazy-load to ensure polyfills are applied before depending libs initialize
  const { TurboFactory } = await import("@ardrive/turbo-sdk");
  const fileSize = fileBuffer.length;

  const turbo = TurboFactory.authenticated({
    privateKey: ARWEAVE_KEY,
  });

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
          value: fileType,
        },
        {
          name: "File-Name",
          value: fileName,
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

  return {
    id,
    dataCaches,
    cost: fileSizeCost,
    fileName,
    fileType,
    fileSize,
    url: `https://arweave.net/${id}`,
  };
}

/**
 * Upload a base64 string to Arweave
 */
export async function uploadBase64ToArweave(
  base64Data: string,
  mimeType: string = "image/png",
  filename: string = "generated-image.png"
): Promise<ArweaveUploadResult> {
  const fileBuffer = Buffer.from(base64Data, "base64");

  return uploadBufferToArweave(fileBuffer, filename, mimeType);
}
