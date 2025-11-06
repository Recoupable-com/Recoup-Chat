import { z } from "zod";
import { tool } from "ai";
import { deleteScheduledActions } from "@/lib/supabase/scheduled_actions/deleteScheduledActions";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export interface DeleteTaskResult {
  actions: ScheduledAction[];
  message: string;
  error?: string;
}

const deleteTask = tool({
  description: `
  Delete one or more tasks from the system. Requires an array of task IDs to delete.
  `,
  inputSchema: z.object({
    ids: z
      .array(z.string())
      .min(1)
      .describe("Array of IDs of the tasks to delete."),
  }),
  execute: async ({ ids }): Promise<DeleteTaskResult> => {
    try {
      const actions = await deleteScheduledActions(ids);
      const deletedCount = actions.length;

      return {
        actions,
        message: `Successfully deleted ${deletedCount} task(s).`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete tasks for unknown reason";
      return {
        actions: [],
        error: errorMessage,
        message: `Failed to delete tasks: ${errorMessage}`,
      };
    }
  },
});

export default deleteTask;

