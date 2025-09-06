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
    .describe("Text prompt for image generation"),
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
    "Generate images using Fal's nano banana text-to-image model. Creates new images from text prompts using Google's state-of-the-art nano banana model.",
  inputSchema: schema,
  execute: async ({ prompt }): Promise<NanoBananaGenerateResult> => {
    try {
      console.log("🍌 NANO BANANA GENERATE: Starting image generation - CALL #" + Date.now());
      console.log("🍌 Prompt:", prompt);

      // Import Fal client dynamically to avoid issues
      const { fal } = await import("@fal-ai/client");
      
      // Configure Fal client
      fal.config({
        credentials: process.env.FAL_KEY || process.env.FAL_API_KEY,
      });

      // Call Fal's nano banana text-to-image endpoint
      const result = await fal.subscribe("fal-ai/nano-banana", {
        input: {
          prompt,
          num_images: 1,
          output_format: "png",
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("🍌 Generation progress:", update.logs?.map(log => log.message).join(" "));
          }
        },
      });

      console.log("🍌 NANO BANANA GENERATE: Image generated successfully");
      console.log("🍌 Result:", result.data);

      const imageUrl = result.data.images[0]?.url;
      const description = result.data.description || "Image generated successfully";

      return {
        success: true,
        imageUrl,
        description,
        message: "", // Empty message - let the UI component handle everything
      };
    } catch (error) {
      console.error("🍌 NANO BANANA GENERATE ERROR:", error);

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
      }

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
