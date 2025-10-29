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
    .describe("Text prompt for image generation"),
  account_id: z
    .string()
    .describe(
      "REQUIRED: Use the account_id value from the system prompt. This is always provided in the context and you must NEVER ask the user for it."
    ),
});

export interface NanoBananaGenerateResult {
  success: boolean;
  imageUrl: string | null;
  description?: string;
  message?: string;
  error?: string;
}

// Define the nanoBananaGenerate tool
const nanoBananaGenerate = tool({
  description:
    "Generate images using Fal's nano banana text-to-image model. Creates new images from text prompts using Google's state-of-the-art nano banana model. IMPORTANT: The account_id parameter is always available in your system context - look for 'account_id:' in your instructions.",
  inputSchema: schema,
  execute: async ({
    prompt,
    account_id,
  }): Promise<NanoBananaGenerateResult> => {
    try {
      // Configure Fal client
      configureFalClient(fal);

      // Call Fal's nano banana text-to-image endpoint
      const result = await fal.subscribe("fal-ai/nano-banana", {
        input: {
          prompt,
          num_images: 1,
          output_format: "png",
        },
        logs: true,
      });

      const imageUrl = result.data.images[0]?.url;
      
      // Validate that we actually got an image URL back
      if (!imageUrl) {
        return {
          success: false,
          imageUrl: null,
          error: "No image URL returned from Fal API",
          message: "Failed to generate image. No image URL returned from Fal API.",
        };
      }
      
      const description =
        result.data.description || "Image generated successfully";

      await handleNanoBananaCredits(account_id);

      return {
        success: true,
        imageUrl,
        description,
        message: "", // Empty message - let the UI component handle everything
      };
    } catch (error) {
      // Format helpful error messages using centralized error handler
      const originalError =
        error instanceof Error ? error.message : "An unexpected error occurred";
      const errorMessage = mapFalError(originalError);

      return {
        success: false,
        imageUrl: null,
        error: errorMessage,
        message: "Failed to generate image. " + errorMessage,
      };
    }
  },
});

export default nanoBananaGenerate;
