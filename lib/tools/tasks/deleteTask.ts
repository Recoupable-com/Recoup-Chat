import { z } from "zod";
import { tool } from "ai";
import { deleteTask } from "@/lib/tasks/deleteTask";
import { getTasks } from "@/lib/tasks/getTasks";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export interface DeleteTaskResult {
  task: ScheduledAction | null;
  message: string;
  error?: string;
}

const deleteTaskTool = tool({
  description: `
  Delete a task from the system. Requires the task ID to delete.
  `,
  inputSchema: z.object({
    id: z.string().describe("UUID of the task to delete."),
  }),
  execute: async ({ id }): Promise<DeleteTaskResult> => {
    try {
      // Fetch task before deletion so we can return it for display
      const tasks = await getTasks({ id });
      const taskToDelete = tasks.length > 0 ? tasks[0] : null;

      // Delete the task
      await deleteTask({ id });

      return {
        task: taskToDelete,
        message: `Successfully deleted task`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete task for unknown reason";
      return {
        task: null,
        error: errorMessage,
        message: `Failed to delete task: ${errorMessage}`,
      };
    }
  },
});

export default deleteTaskTool;
