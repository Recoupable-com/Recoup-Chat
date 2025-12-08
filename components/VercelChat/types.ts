import { Tables } from "@/types/database.types";

// IMAGES
export interface ImageGenerationResult {
  success: boolean;
  arweaveUrl: string | null;
  message?: string;
  error?: string;
}

// TASKS
type ScheduledAction = Tables<"scheduled_actions">;

export interface GetTasksResult {
  tasks: ScheduledAction[];
  message: string;
  error?: string;
}

export interface CreateTaskResult {
  task: ScheduledAction;
  message: string;
  error?: string;
}

export interface DeleteTaskResult {
  task: ScheduledAction | null;
  message: string;
  error?: string;
}

export interface UpdateTaskResult {
  task: ScheduledAction;
  message: string;
  error?: string;
}

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
