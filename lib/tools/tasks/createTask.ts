import { z } from "zod";
import { tool } from "ai";
import { createTask } from "@/lib/tasks/createTask";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export interface CreateTaskResult {
  task: ScheduledAction;
  message: string;
  error?: string;
}

const createTaskTool = tool({
  description: `
  Create a new task in the system. A task represents a scheduled action that will be executed on a schedule.
  Requires the following:
  - title: A descriptive name for the task
  - prompt: The instruction or prompt to be executed
  - schedule: A cron expression defining when the task should run
  - account_id: The account ID of the user creating the task
  - artist_account_id: The account ID of the artist this task is for
  
  The schedule parameter must be a valid cron expression (e.g. "0 0 * * *" for daily at midnight).
  `,
  inputSchema: z.object({
    title: z.string().describe("The title of the task"),
    prompt: z.string().describe("The instruction or prompt to be executed"),
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
  }),
  execute: async ({
    title,
    prompt,
    schedule,
    account_id,
    artist_account_id,
  }): Promise<CreateTaskResult> => {
    try {
      const createdTask = await createTask({
        title,
        prompt,
        schedule,
        account_id,
        artist_account_id,
      });

      return {
        task: createdTask,
        message: `Successfully created task`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create task for unknown reason";
      return {
        task: {} as ScheduledAction,
        error: errorMessage,
        message: `Failed to create task: ${errorMessage}`,
      };
    }
  },
});

export default createTaskTool;
