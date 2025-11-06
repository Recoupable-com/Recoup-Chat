import { TASKS_API_URL } from "@/lib/consts";

export interface DeleteTaskParams {
  id: string;
}

export interface DeleteTaskResponse {
  status: "success" | "error";
  error?: string;
}

/**
 * Deletes a task via the Recoup API
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
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data: DeleteTaskResponse = await response.json();

    if (data.status === "error") {
      throw new Error(data.error || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

