import { experimental_generateImage as generate } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  ArweaveUploadResult,
  uploadBase64ToArweave,
} from "../arweave/uploadBase64ToArweave";

const generateImage = async (
  prompt: string
): Promise<ArweaveUploadResult | null> => {
  const response = await generate({
    model: openai.image("gpt-image-1"),
    prompt,
    providerOptions: {
      openai: { quality: "high" },
    },
  });

  // The base64Data isn't properly typed in the ai SDK, so we need to cast the response
  // @ts-expect-error The 'image' object from generateImage includes base64Data but it's not in the type
  const base64Data: string = response.image.base64Data;

  const imageData = {
    base64Data,
    mimeType: response.image.mediaType,
  };

  // Upload the generated image to Arweave
  let arweaveData = null;
  try {
    arweaveData = await uploadBase64ToArweave(
      imageData.base64Data,
      imageData.mimeType,
      `generated-image-${Date.now()}.png`
    );
    if (arweaveData) {
      arweaveData.previewUrl = `data:${imageData.mimeType};base64,${imageData.base64Data}`;
    }
  } catch (arweaveError) {
    console.error("Error uploading to Arweave:", arweaveError);
    // We'll continue and return the image even if Arweave upload fails
  }
  return arweaveData;
};

export default generateImage;
