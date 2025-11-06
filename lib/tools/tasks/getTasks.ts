import { z } from "zod";
import { tool } from "ai";
import { getTasks } from "@/lib/tasks/getTasks";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export interface GetTasksResult {
  actions: ScheduledAction[];
  message: string;
  error?: string;
}

const getTasksTool = tool({
  description: `
  Retrieve tasks from the system. Can filter by account_id, artist_account_id, and enabled status.
  All filter parameters are optional:
  - account_id: Filter tasks by the user who created them
  - artist_account_id: Filter tasks by the artist account ID they are for
  - enabled: Filter tasks by their enabled status (true/false)
  
  If no filters are provided, returns all tasks the user has access to.
  `,
  inputSchema: z.object({
    account_id: z
      .string()
      .optional()
      .describe(
        "Optional: Filter tasks by the account ID of the user who created them. Get this from the system prompt. Do not ask for this."
      ),
    artist_account_id: z
      .string()
      .optional()
      .describe(
        "Optional: Filter tasks by the artist account ID. If not provided, get the active artist id from the system prompt."
      ),
    enabled: z
      .boolean()
      .optional()
      .describe("Optional: Filter tasks by their enabled status"),
  }),
  execute: async ({
    account_id,
    artist_account_id,
    enabled,
  }): Promise<GetTasksResult> => {
    try {
      const allTasks = await getTasks({
        account_id,
        artist_account_id,
      });

      // Filter by enabled status if provided (client-side filter)
      let filteredTasks = allTasks;
      if (enabled !== undefined) {
        filteredTasks = allTasks.filter((task) => task.enabled === enabled);
      }

      return {
        actions: filteredTasks,
        message: `Successfully retrieved ${filteredTasks.length} task(s)`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to retrieve tasks for unknown reason";
      return {
        actions: [],
        error: errorMessage,
        message: `Failed to retrieve tasks: ${errorMessage}`,
      };
    }
  },
});

export default getTasksTool;
