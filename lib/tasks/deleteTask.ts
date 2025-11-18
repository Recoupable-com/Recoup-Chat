import { TASKS_API_URL } from "@/lib/consts";

export interface DeleteTaskParams {
  id: string;
}

export interface DeleteTaskResponse {
  status: "success" | "error";
  error?: string;
}

const SCHEDULE_NOT_FOUND_MSG = "Schedule not found";

/**
 * Check if error indicates schedule not found in external scheduler
 * Paused tasks are removed from the scheduler, making this error expected
 */
function isScheduleNotFoundError(errorText: string): boolean {
  return errorText.includes(SCHEDULE_NOT_FOUND_MSG);
}

/**
 * Delete task record from database when scheduler deletion isn't possible
 */
async function deleteTaskFromDatabase(taskId: string): Promise<void> {
  await fetch("/api/scheduled-actions/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: taskId }),
  });
}

/**
 * Deletes a task via the Recoup API and database
 * @see https://docs.recoupable.com/tasks/delete
 */
export async function deleteTask(params: DeleteTaskParams): Promise<void> {
  try {
    const response = await fetch(TASKS_API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: params.id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (isScheduleNotFoundError(errorText)) {
        await deleteTaskFromDatabase(params.id);
        return;
      }
      
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data: DeleteTaskResponse = await response.json();

    if (data.status === "error") {
      if (data.error && isScheduleNotFoundError(data.error)) {
        await deleteTaskFromDatabase(params.id);
        return;
      }
      throw new Error(data.error || "Unknown error occurred");
    }
  } catch (error) {
    throw error;
  }
}


