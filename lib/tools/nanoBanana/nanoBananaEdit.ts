import { z } from "zod";
import { tool } from "ai";
import { fal } from "@fal-ai/client";
import { ensureBase64Polyfills } from "@/lib/utils/base64Polyfill";
import { configureFalClient } from "@/lib/utils/falConfig";
import { mapFalError } from "@/lib/utils/falErrorHandler";
import { handleNanoBananaCredits } from "@/lib/credits/handleNanoBananaCredits";

// Ensure base64 polyfills are available for Fal client
ensureBase64Polyfills();

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

export interface NanoBananaEditResult {
  success: boolean;
  imageUrl: string | null;
  description?: string;
  message?: string;
  error?: string;
}

const nanoBananaEdit = tool({
  description:
    "Edit existing images using Fal's nano banana image editing model. Modifies images based on text prompts while preserving the original context and style. IMPORTANT: (1) The account_id parameter is always available in your system context - look for 'account_id:' in your instructions. (2) The imageUrl should be extracted from file attachments in the user's message - check message parts for files with image media types.",
  inputSchema: schema,
  execute: async ({
    prompt,
    imageUrl,
    account_id,
  }): Promise<NanoBananaEditResult> => {
    try {
      // Configure Fal client
      configureFalClient(fal);

      // Call Fal's nano banana image editing endpoint
      const result = await fal.subscribe("fal-ai/nano-banana/edit", {
        input: {
          prompt,
          image_urls: [imageUrl],
          num_images: 1,
          output_format: "png",
        },
        logs: true,
      });

      const editedImageUrl = result.data.images[0]?.url;
      const description =
        result.data.description || "Image edited successfully";
      
      await handleNanoBananaCredits(account_id);

      return {
        success: true,
        imageUrl: editedImageUrl,
        description,
        message: "", // Empty message - let the UI component handle everything
      };
    } catch (error) {
      console.error("🍌 nano_banana_edit ERROR", error);
      
      // Format helpful error messages using centralized error handler
      const originalError =
        error instanceof Error ? error.message : "An unexpected error occurred";
      let errorMessage = mapFalError(originalError);

      // Handle edit-specific errors
      if (originalError.includes("Invalid image URL")) {
        errorMessage = "The image URL provided is invalid or inaccessible.";
      } else if (originalError.includes("Unprocessable Entity")) {
        errorMessage = "The image format or content is not supported for editing. Please try a different image.";
      }

      return {
        success: false,
        imageUrl: null,
        error: errorMessage,
        message: "Failed to edit image. " + errorMessage,
      };
    }
  },
});

export default nanoBananaEdit;
