import { z } from "zod";
import { tool } from "ai";
import { generateAndProcessImage } from "@/lib/generateAndProcessImage";

// Define the schema for input validation
const schema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long"),
  account_id: z
    .string()
    .min(1, "account_id is required")
    .describe(
      "REQUIRED: Use the account_id value from the system prompt. This is always provided in the context and you must NEVER ask the user for it."
    ),
});

/**
 * Interface for image generation result
 */
export interface ImageGenerationResult {
  success: boolean;
  arweaveUrl: string | null;
  message?: string;
  error?: string;
}

// Define the generateImage tool
const generateImage = tool({
  description:
    "Generate an image based on a text prompt. The image will be automatically stored on Arweave and includes In Process moment metadata for provenance and ownership tracking.",
  inputSchema: schema,
  execute: async ({ prompt, account_id }): Promise<ImageGenerationResult> => {
    try {
      // Generate the image with the provided prompt
      const result = await generateAndProcessImage(prompt, account_id);

      // Create a response in a format useful for the chat interface
      return {
        success: true,
        arweaveUrl: result.imageUrl || null,
        message: "Image successfully generated and stored onchain.",
      };
    } catch (error) {
      console.error("Error in generateImage tool:", error);

      // Format helpful error messages based on common issues
      let errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      if (errorMessage.includes("content policy")) {
        errorMessage =
          "Your prompt may violate content policy. Please try a different prompt.";
      } else if (errorMessage.includes("rate limit")) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      }

      return {
        success: false,
        arweaveUrl: null,
        error: errorMessage,
        message: "Failed to generate image. " + errorMessage,
      };
    }
  },
});

export default generateImage;
