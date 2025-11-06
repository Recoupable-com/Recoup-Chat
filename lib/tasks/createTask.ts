import { Tables } from "@/types/database.types";
import { TASKS_API_URL } from "@/lib/consts";

type ScheduledAction = Tables<"scheduled_actions">;

export interface CreateTaskParams {
  title: string;
  prompt: string;
  schedule: string;
  account_id: string;
  artist_account_id: string;
}

export interface CreateTaskResponse {
  status: "success" | "error";
  tasks: ScheduledAction[];
  error?: string;
}

/**
 * Creates a new task via the Recoup API
 * @see https://docs.recoupable.com/tasks/create
 */
export async function createTask(
  params: CreateTaskParams
): Promise<ScheduledAction> {
  try {
    const response = await fetch(TASKS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: params.title,
        prompt: params.prompt,
        schedule: params.schedule,
        account_id: params.account_id,
        artist_account_id: params.artist_account_id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data: CreateTaskResponse = await response.json();

    if (data.status === "error") {
      throw new Error(data.error || "Unknown error occurred");
    }

    if (!data.tasks || data.tasks.length === 0) {
      throw new Error("API returned success but no task was created");
    }

    return data.tasks[0];
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}
