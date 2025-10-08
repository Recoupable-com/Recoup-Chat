import { z } from "zod";
import { tool } from "ai";
import { retrieveVideo } from "@/lib/openai/retrieveVideo";
import { GenerateVideoResponse } from "@/lib/openai/generateVideo";
import { getOpenAIErrorMessage } from "@/lib/openai/getOpenAIErrorMessage";

const schema = z.object({
  video_id: z
    .string()
    .min(1, "Video ID is required")
    .describe(
      "The video ID returned from generate_sora_2_video tool (e.g., 'video_123')"
    ),
});

export interface RetrieveVideoResult extends GenerateVideoResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const retrieveVideoTool = tool({
  description: `Retrieve the status and details of a video generation job.
    
    Use this tool to:
    - Check the progress of a video generation job
    - Check if the video is completed, failed, or still processing
    - Get job details like progress, created_at, size, and seconds
    
    IMPORTANT:
    - Requires the video_id from generate_sora_2_video tool
    - Status can be: "queued", "processing", "completed", or "failed"
    - Progress field shows 0-100 for processing jobs`,
  inputSchema: schema,
  execute: async ({ video_id }): Promise<RetrieveVideoResult> => {
    try {
      const data = await retrieveVideo(video_id);

      return {
        success: true,
        ...data,
        message:
          data.status === "completed"
            ? `Video generation complete!`
            : data.status === "processing"
              ? `Video is still processing. Progress: ${data.progress || 0}%`
              : data.status === "queued"
                ? `Video generation is queued. Please check back shortly.`
                : `Video status: ${data.status}`,
      };
    } catch (error) {
      console.error("Error in retrieveVideo tool:", error);

      const errorMessage = getOpenAIErrorMessage(error);

      return {
        success: false,
        id: video_id,
        object: "video",
        model: "sora-2",
        status: "failed",
        size: "",
        seconds: "",
        error: errorMessage,
        message: "Failed to retrieve video. " + errorMessage,
      };
    }
  },
});

export default retrieveVideoTool;
