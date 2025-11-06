import { z } from "zod";
import { tool } from "ai";
import { updateTask } from "@/lib/tasks/updateTask";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export interface UpdateTaskResult {
  action: ScheduledAction;
  message: string;
  error?: string;
}

const updateTaskTool = tool({
  description: `
  Update an existing task in the system. Only the id field is required; any additional fields you include will be updated on the task.
  
  Updatable fields include:
  - title: A descriptive name for the task
  - prompt: The instruction or prompt to be executed
  - schedule: A cron expression defining when the task should run
  - account_id: The account ID of the user who owns the task
  - artist_account_id: The account ID of the artist this task is for
  
  The schedule parameter must be a valid cron expression (e.g. "0 0 * * *" for daily at midnight).
  Only fields provided (beyond id) will be updated. Omitting a field leaves the existing value unchanged.
  `,
  inputSchema: z.object({
    id: z.string().describe("UUID of the task to update"),
    title: z.string().optional().describe("New descriptive title of the task"),
    prompt: z
      .string()
      .optional()
      .describe("New instruction/prompt executed by the task"),
    schedule: z
      .string()
      .optional()
      .describe("New cron expression defining when the task runs"),
    account_id: z
      .string()
      .optional()
      .describe(
        "New UUID of the associated account. Get this from the system prompt. Do not ask for this."
      ),
    artist_account_id: z
      .string()
      .optional()
      .describe(
        "New UUID of the associated artist account. If not provided, get this from the system prompt as the active artist id."
      ),
  }),
  execute: async ({
    id,
    title,
    prompt,
    schedule,
    account_id,
    artist_account_id,
  }): Promise<UpdateTaskResult> => {
    try {
      const updatedTask = await updateTask({
        id,
        ...(title !== undefined && { title }),
        ...(prompt !== undefined && { prompt }),
        ...(schedule !== undefined && { schedule }),
        ...(account_id !== undefined && { account_id }),
        ...(artist_account_id !== undefined && { artist_account_id }),
      });

      return {
        action: updatedTask,
        message: `Successfully updated task`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update task for unknown reason";
      return {
        action: {} as ScheduledAction,
        error: errorMessage,
        message: `Failed to update task: ${errorMessage}`,
      };
    }
  },
});

export default updateTaskTool;
