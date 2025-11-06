import { z } from "zod";
import { tool } from "ai";
import { insertScheduledActions } from "@/lib/supabase/scheduled_actions/insertScheduledActions";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export interface CreateTasksResult {
  actions: ScheduledAction[];
  message: string;
  error?: string;
}

const createTasks = tool({
  description: `
  Create new tasks in the system. Each task represents a scheduled action that will be executed on a schedule.
  Requires the following for each task:
  - title: A descriptive name for the task
  - prompt: The instruction or prompt to be executed
  - schedule: A cron expression defining when the task should run
  - account_id: The account ID of the user creating the task
  - artist_account_id: The account ID of the artist this task is for
  
  The schedule parameter must be a valid cron expression (e.g. "0 0 * * *" for daily at midnight).
  `,
  inputSchema: z.object({
    actions: z
      .array(
        z.object({
          title: z.string().describe("The title of the task"),
          prompt: z
            .string()
            .describe("The instruction or prompt to be executed"),
          schedule: z
            .string()
            .describe("Cron expression for when the task should run"),
          account_id: z
            .string()
            .describe(
              "The account ID of the user creating the task. Get this from the system prompt. Do not ask for this."
            ),
          artist_account_id: z
            .string()
            .describe(
              "The account ID of the artist this task is for. If not provided, get this from the system prompt as the active artist id."
            ),
          enabled: z
            .boolean()
            .optional()
            .describe("Whether the task is enabled (defaults to true)"),
        })
      )
      .describe("Array of tasks to create"),
  }),
  execute: async ({ actions }): Promise<CreateTasksResult> => {
    try {
      const createdActions = await insertScheduledActions(actions);

      return {
        actions: createdActions,
        message: `Successfully created ${createdActions.length} task(s)`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create tasks for unknown reason";
      return {
        actions: [],
        error: errorMessage,
        message: `Failed to create tasks: ${errorMessage}`,
      };
    }
  },
});

export default createTasks;
