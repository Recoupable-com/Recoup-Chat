import { z } from "zod";
import { tool } from "ai";
import { updateScheduledActions } from "@/lib/supabase/scheduled_actions/updateScheduledActions";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export interface UpdateTaskResult {
  actions: ScheduledAction[];
  message: string;
  error?: string;
}

const updateTask = tool({
  description: `
  Update multiple existing tasks in the system. Requires an array of task IDs and the fields to update.
  The same updates will be applied to all specified tasks.

  Updatable fields include:
  - title: A descriptive name for the task
  - prompt: The instruction or prompt to be executed
  - schedule: A cron expression defining when the task should run
  - enabled: Whether the task is enabled or disabled
  - account_id: The account ID of the user who owns the task
  - artist_account_id: The account ID of the artist this task is for
  
  The schedule parameter must be a valid cron expression (e.g. "0 0 * * *" for daily at midnight).
  You cannot update the id, created_at, or updated_at fields.

  All specified tasks will receive the same updates. If you need different updates for different tasks,
  make multiple calls to this tool.
  `,
  inputSchema: z.object({
    ids: z
      .array(z.string())
      .min(1)
      .describe("Array of IDs of the tasks to update"),
    updates: z
      .object({
        title: z
          .string()
          .optional()
          .describe("The new title for the tasks"),
        prompt: z
          .string()
          .optional()
          .describe("The new instruction or prompt to be executed"),
        schedule: z
          .string()
          .optional()
          .describe("New cron expression for when the tasks should run"),
        enabled: z
          .boolean()
          .optional()
          .describe("Whether the tasks should be enabled or disabled"),
        account_id: z
          .string()
          .optional()
          .describe("The new account ID of the user who owns the tasks"),
        artist_account_id: z
          .string()
          .optional()
          .describe("The new artist account ID these tasks are for"),
      })
      .describe("The fields to update on the tasks"),
  }),
  execute: async ({ ids, updates }): Promise<UpdateTaskResult> => {
    try {
      const actions = await updateScheduledActions({ ids, updates });
      const updatedCount = actions.length;
      const totalCount = ids.length;
      const partialUpdate = updatedCount !== totalCount;

      let message = `Successfully updated ${updatedCount} task(s)`;
      if (partialUpdate) {
        message += ` (${totalCount - updatedCount} tasks were not found or could not be updated)`;
      }

      return {
        actions,
        message,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update tasks for unknown reason";
      return {
        actions: [],
        error: errorMessage,
        message: `Failed to update tasks: ${errorMessage}`,
      };
    }
  },
});

export default updateTask;

