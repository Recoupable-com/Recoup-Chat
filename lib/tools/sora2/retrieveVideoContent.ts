import { z } from "zod";
import { tool } from "ai";
import { retrieveVideoContent } from "@/lib/openai/retrieveVideoContent";
import { getOpenAIErrorMessage } from "@/lib/openai/getOpenAIErrorMessage";

const schema = z.object({
  video_id: z
    .string()
    .min(1, "Video ID is required")
    .describe(
      "The video ID from generate_sora_2_video tool (e.g., 'video_123')"
    ),
});

export interface RetrieveVideoContentResult {
  success: boolean;
  video_id: string;
  videoUrl?: string;
  contentType: string;
  size: number;
  sizeInMB: string;
  message?: string;
  error?: string;
}

const retrieveVideoContentTool = tool({
  description: `Download and retrieve the rendered video content for a completed video generation job.
    
    Use this tool to:
    - Download the actual video file after generation is complete
    - Get metadata about the video file (size, content type)
    - Verify that the video content is available
    
    IMPORTANT:
    - Requires the video_id from generate_sora_2_video tool
    - Only works when video status is "completed" (check with retrieve_sora_2_video first)
    - Downloads the actual video file content (this may take some time)
    - Returns video metadata including file size and content type`,
  inputSchema: schema,
  execute: async ({ video_id }): Promise<RetrieveVideoContentResult> => {
    try {
      const data = await retrieveVideoContent(video_id);

      const sizeInMB = (data.size / (1024 * 1024)).toFixed(2);

      return {
        success: true,
        video_id,
        videoUrl: data.dataUrl,
        contentType: data.contentType,
        size: data.size,
        sizeInMB: `${sizeInMB} MB`,
        message: `Video content downloaded successfully. File size: ${sizeInMB} MB, Content type: ${data.contentType}`,
      };
    } catch (error) {
      console.error("Error in retrieveVideoContent tool:", error);

      const errorMessage = getOpenAIErrorMessage(error);

      return {
        success: false,
        video_id,
        contentType: "",
        size: 0,
        sizeInMB: "0 MB",
        error: errorMessage,
        message: "Failed to retrieve video content. " + errorMessage,
      };
    }
  },
});

export default retrieveVideoContentTool;
