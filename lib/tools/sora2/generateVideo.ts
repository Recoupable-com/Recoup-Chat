import { z } from "zod";
import { tool } from "ai";
import {
  generateVideo,
  GenerateVideoResponse,
} from "@/lib/openai/generateVideo";
import { getOpenAIErrorMessage } from "@/lib/openai/getOpenAIErrorMessage";

const schema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .describe("Text description of the video to generate"),
  seconds: z
    .number()
    .min(4)
    .optional()
    .describe("Duration of the video in seconds (default: 4, max: 20)"),
  size: z
    .enum(["720x1280", "1280x720"])
    .optional()
    .describe(
      "Size of the video: 720x1280 (default portrait), 1280x720 (landscape)"
    ),
});

export interface VideoGenerationResult extends GenerateVideoResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const generateVideoTool = tool({
  description: `Generate a video from a text prompt using OpenAI's Sora 2 model.
    
    This tool creates high-quality videos based on detailed text descriptions.
    
    IMPORTANT:
    - Provide detailed, vivid descriptions for best results
    - Videos can be 4 to 20 seconds in length
    - Supported sizes: 720x1280 (default portrait), 1280x720 (landscape)
    - Generation may take several minutes to complete`,
  inputSchema: schema,
  execute: async ({
    prompt,
    seconds = 8,
    size = "720x1280",
  }): Promise<VideoGenerationResult> => {
    try {
      const data = await generateVideo({
        model: "sora-2",
        prompt,
        seconds,
        size,
      });

      // Video generation is async - returns a job object
      return {
        success: true,
        id: data.id,
        object: data.object,
        model: data.model,
        status: data.status,
        progress: data.progress,
        created_at: data.created_at,
        size: data.size,
        seconds: data.seconds,
        quality: data.quality,
        message:
          data.status === "completed"
            ? `Video successfully generated: ${data.seconds}s at ${data.size} resolution.`
            : `Video generation job created. Status: ${data.status}. Use the video ID to check progress and retrieve the video when complete.`,
      };
    } catch (error) {
      console.error("Error in generateSora2Video tool:", error);

      const errorMessage = getOpenAIErrorMessage(error);

      return {
        success: false,
        id: "",
        object: "video",
        model: "sora-2",
        status: "failed",
        size: size,
        seconds: seconds.toString(),
        error: errorMessage,
        message: "Failed to generate video. " + errorMessage,
      };
    }
  },
});

export default generateVideoTool;
