import { z } from "zod";
import { tool } from "ai";
import { generateAndProcessImage } from "@/lib/generateAndProcessImage";
import { ImageGenerationResult } from "./generateImage";

const schema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long")
    .describe("Text prompt for image editing"),
  imageUrl: z
    .string()
    .url("Must be a valid image URL")
    .describe("URL of the image to edit"),
  account_id: z
    .string()
    .describe(
      "REQUIRED: Use the account_id value from the system prompt. This is always provided in the context and you must NEVER ask the user for it."
    ),
});

const editImage = tool({
  description:
    "Edit existing images. Modifies images based on text prompts while preserving the original context and style. IMPORTANT: (1) The account_id parameter is always available in your system context - look for 'account_id:' in your instructions. (2) The imageUrl should be extracted from file attachments in the user's message - check message parts for files with image media types.",
  inputSchema: schema,
  execute: async ({
    prompt,
    imageUrl,
    account_id,
  }): Promise<ImageGenerationResult> => {
    try {
      const result = await generateAndProcessImage(prompt, account_id, [
        {
          url: imageUrl,
          type: "image/png",
        },
      ]);

      return {
        success: true,
        arweaveUrl: result.imageUrl || null,
        message: "Image successfully edited.",
      };
    } catch (error) {
      console.error("Error in editImage tool:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return {
        success: false,
        arweaveUrl: null,
        error: errorMessage,
        message: "Failed to edit image. " + errorMessage,
      };
    }
  },
});

export default editImage;
