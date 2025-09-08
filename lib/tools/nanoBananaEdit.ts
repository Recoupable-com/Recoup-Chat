import { z } from "zod";
import { tool } from "ai";

// Ensure base64 polyfills are available for Fal client
if (typeof globalThis.atob === "undefined") {
  globalThis.atob = (data: string) => Buffer.from(data, "base64").toString("binary");
}
if (typeof globalThis.btoa === "undefined") {
  globalThis.btoa = (data: string) => Buffer.from(data, "binary").toString("base64");
}

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
      console.log("🍌 NANO BANANA EDIT: Starting image editing");
      console.log("🍌 Prompt:", prompt);
      console.log("🍌 Original image URL:", imageUrl);

      // Import Fal client dynamically to avoid issues
      const { fal } = await import("@fal-ai/client");
      
      // Configure Fal client
      fal.config({
        credentials: process.env.FAL_KEY || process.env.FAL_API_KEY,
      });

      // Call Fal's nano banana image editing endpoint
      const result = await fal.subscribe("fal-ai/nano-banana/edit", {
        input: {
          prompt,
          image_urls: [imageUrl],
          num_images: 1,
          output_format: "png",
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("🍌 Edit progress:", update.logs?.map(log => log.message).join(" "));
          }
        },
      });

      console.log("🍌 NANO BANANA EDIT: Image editing completed successfully");
      console.log("🍌 Result:", result.data);

      const editedImageUrl = result.data.images[0]?.url;
      const description = result.data.description || "Image edited successfully";

      return {
        success: true,
        imageUrl: editedImageUrl,
        description,
        message: "", // Empty message - let the UI component handle everything
      };
    } catch (error) {
      console.error("🍌 NANO BANANA EDIT ERROR:", error);

      // Format helpful error messages
      let errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      if (errorMessage.includes("API key") || errorMessage.includes("credentials")) {
        errorMessage =
          "Fal AI API key is missing or invalid. Please check your FAL_KEY environment variable.";
      } else if (errorMessage.includes("content policy")) {
        errorMessage =
          "Your prompt may violate content policy. Please try a different prompt.";
      } else if (errorMessage.includes("rate limit")) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      } else if (errorMessage.includes("Invalid image URL")) {
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
