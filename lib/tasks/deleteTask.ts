import { TASKS_API_URL } from "@/lib/consts";

export interface DeleteTaskParams {
  id: string;
}

export interface DeleteTaskResponse {
  status: "success" | "error";
  error?: string;
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
      
      // Paused tasks are removed from scheduler, so "not found" is expected
      if (errorText.includes("Schedule not found")) {
        await fetch("/api/scheduled-actions/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: params.id }),
        });
        return;
      }
      
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data: DeleteTaskResponse = await response.json();

    if (data.status === "error") {
      // Paused tasks are removed from scheduler, so "not found" is expected
      if (data.error?.includes("Schedule not found")) {
        await fetch("/api/scheduled-actions/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: params.id }),
        });
        return;
      }
      throw new Error(data.error || "Unknown error occurred");
    }
  } catch (error) {
    throw error;
  }
}


