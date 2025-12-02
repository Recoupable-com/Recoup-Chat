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
      // Determine media type from URL extension, default to image/png
      const getMediaType = (url: string): string => {
        const extension = url.split(".").pop()?.toLowerCase();
        const mediaTypeMap: Record<string, string> = {
          png: "image/png",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          gif: "image/gif",
          webp: "image/webp",
          svg: "image/svg+xml",
        };
        return mediaTypeMap[extension || ""] || "image/png";
      };

      // Generate the edited image with the provided prompt and image URL
      const result = await generateAndProcessImage(prompt, account_id, [
        {
          url: imageUrl,
          type: getMediaType(imageUrl),
        },
      ]);

      // Create a response in a format useful for the chat interface
      return {
        success: true,
        arweaveUrl: result.imageUrl || null,
        message: "Image successfully edited.",
      };
    } catch (error) {
      console.error("Error in editImage tool:", error);

      // Format helpful error messages based on common issues
      let errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      if (errorMessage.includes("content policy")) {
        errorMessage =
          "Your prompt may violate content policy. Please try a different prompt.";
      } else if (errorMessage.includes("rate limit")) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      } else if (errorMessage.includes("Invalid image URL")) {
        errorMessage = "The image URL provided is invalid or inaccessible.";
      } else if (errorMessage.includes("Unprocessable Entity")) {
        errorMessage =
          "The image format or content is not supported for editing. Please try a different image.";
      }

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
