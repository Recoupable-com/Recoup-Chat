import { Tables } from "@/types/database.types";

// IMAGES
export interface ImageGenerationResult {
  imageUrl: string | null;
}

// TASKS
export type ScheduledAction = Tables<"scheduled_actions">;

// SORA 2
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
