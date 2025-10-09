import { getArweaveClient, getArweaveKey } from "./client";

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
export async function uploadBufferToArweave(
  fileBuffer: Buffer,
  fileName: string,
  fileType: string
): Promise<ArweaveUploadResult> {
  const arweave = getArweaveClient();
  const key = getArweaveKey();
  const resolvedFileType = fileType || "application/octet-stream";
  const fileSize = fileBuffer.length;

  const fileSizeCost = await arweave.transactions.getPrice(fileSize);

  const transaction = await arweave.createTransaction(
    { data: fileBuffer },
    key
  );

  transaction.addTag("Content-Type", resolvedFileType);
  transaction.addTag("File-Name", fileName);
  transaction.addTag("App-Name", "Recoup-Chat");
  transaction.addTag("Content-Type-Group", "image");

  await arweave.transactions.sign(transaction, key);

  const response = await arweave.transactions.post(transaction);

  if (response.status >= 300) {
    throw new Error(
      `Arweave upload failed with status ${response.status}: ${response.statusText}`
    );
  }

  return {
    id: transaction.id,
    dataCaches: [],
    cost: fileSizeCost.toString(),
    fileName,
    fileType: resolvedFileType,
    fileSize,
    url: `https://arweave.net/${transaction.id}`,
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
