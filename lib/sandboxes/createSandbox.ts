import { NEW_API_BASE_URL } from "@/lib/consts";

export interface Sandbox {
  sandboxId: string;
  sandboxStatus: "pending" | "running" | "stopping" | "stopped" | "failed";
  timeout: number;
  createdAt: string;
  runId?: string;
}

interface CreateSandboxResponse {
  status: "success" | "error";
  sandboxes?: Sandbox[];
  error?: string;
}

export async function createSandbox(
  prompt: string,
  accessToken: string
): Promise<Sandbox[]> {
  const fullPrompt = `${prompt}\n\nAfter completing the task, commit and push all changes directly to the main branch.`;

  const response = await fetch(`${NEW_API_BASE_URL}/api/sandboxes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      command: "opencode",
      args: ["run", fullPrompt],
    }),
  });

  const data: CreateSandboxResponse = await response.json();

  if (!response.ok || data.status === "error") {
    throw new Error(data.error || "Failed to create sandbox");
  }

  return data.sandboxes || [];
}
