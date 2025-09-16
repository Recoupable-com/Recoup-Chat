import { z } from "zod";
import { tool } from "ai";
import { fal } from "@fal-ai/client";
import { ensureBase64Polyfills } from "@/lib/utils/base64Polyfill";
import { configureFalClient } from "@/lib/utils/falConfig";
import { mapFalError } from "@/lib/utils/falErrorHandler";

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
});

export interface NanoBananaEditResult {
  success: boolean;
  imageUrl: string | null;
  description?: string;
  message?: string;
  error?: string;
}

// Define the nanoBananaEdit tool
const nanoBananaEdit = tool({
  description:
    "Edit existing images using Fal's nano banana image editing model. Modifies images based on text prompts while preserving the original context and style.",
  inputSchema: schema,
  execute: async ({ prompt, imageUrl }): Promise<NanoBananaEditResult> => {
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
        onQueueUpdate: () => {
          // Progress tracking could be added here if needed
        },
      });


      const editedImageUrl = result.data.images[0]?.url;
      const description = result.data.description || "Image edited successfully";

      return {
        success: true,
        imageUrl: editedImageUrl,
        description,
        message: "", // Empty message - let the UI component handle everything
      };
    } catch (error) {

      // Format helpful error messages using centralized error handler
      const originalError = error instanceof Error ? error.message : "An unexpected error occurred";
      let errorMessage = mapFalError(originalError);
      
      // Handle edit-specific errors
      if (originalError.includes("Invalid image URL")) {
        errorMessage = "The image URL provided is invalid or inaccessible.";
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
