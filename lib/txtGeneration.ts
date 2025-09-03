import {
  ArweaveUploadResult,
  uploadBase64ToArweave,
} from "@/lib/arweave/uploadBase64ToArweave";
import createCollection from "@/app/api/in_process/createCollection";
import { uploadMetadataJson } from "./arweave/uploadMetadataJson";

export interface GeneratedTxtResponse {
  txt: {
    base64Data: string;
    mimeType: string;
  };
  arweave?: ArweaveUploadResult | null;
  smartAccount: {
    address: string;
    [key: string]: unknown;
  };
  transactionHash: string | null;
}

export async function generateAndStoreTxtFile(
  contents: string
): Promise<GeneratedTxtResponse> {
  if (!contents) {
    throw new Error("Contents are required");
  }

  // Encode contents to base64
  const base64Data = Buffer.from(contents, "utf-8").toString("base64");
  const mimeType = "text/plain";
  const filename = `generated-text-${Date.now()}.txt`;

  // Upload the TXT file to Arweave
  let txtFile = null;
  try {
    txtFile = await uploadBase64ToArweave(base64Data, mimeType, filename);
  } catch (arweaveError) {
    console.error("Error uploading TXT to Arweave:", arweaveError);
    // Continue and return the TXT even if Arweave upload fails
  }

  const image = "ar://EXwe2peizXKxjUMop6W-JPflC5sWyeQR1y0JiRDwUB0";

  // Upload metadata JSON to Arweave
  let metadataArweave = null;
  try {
    metadataArweave = await uploadMetadataJson({
      image,
      animation_url: txtFile?.url,
      content: {
        mime: mimeType,
        uri: txtFile?.url || "",
      },
      description: contents,
      name: contents,
    });
  } catch (metadataError) {
    console.error("Error uploading metadata to Arweave:", metadataError);
  }

  // Create a collection on the blockchain using the metadata id
  const result = await createCollection({
    collectionName: contents,
    uri: metadataArweave ? `ar://${metadataArweave.id}` : "",
  });
  const transactionHash = result.transactionHash || null;

  return {
    txt: {
      base64Data,
      mimeType,
    },
    arweave: txtFile,
    smartAccount: result.smartAccount,
    transactionHash,
  };
}
