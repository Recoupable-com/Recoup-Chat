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
 * Upload a base64 string to Arweave
 */
export async function uploadBase64ToArweave(
  base64Data: string,
  mimeType: string = "image/png",
  filename: string = "generated-image.png"
): Promise<ArweaveUploadResult> {
  // Temporary Edge-safe stub: returns a synthetic Arweave-like result
  // without performing any network or Node-specific operations.
  const estimatedSize = Math.floor((base64Data.length * 3) / 4);
  return Promise.resolve({
    id: "disabled-upload",
    dataCaches: [],
    cost: "0",
    fileName: filename,
    fileType: mimeType,
    fileSize: Number.isFinite(estimatedSize) ? estimatedSize : 0,
    url: "https://arweave.net/disabled-upload",
  });
}
