import { NEW_API_BASE_URL } from "@/lib/consts";
import type { Sandbox } from "./createSandbox";

interface GetSandboxesResponse {
  status: "success" | "error";
  sandboxes?: Sandbox[];
  error?: string;
}

export async function getSandboxes(accessToken: string): Promise<Sandbox[]> {
  const response = await fetch(`${NEW_API_BASE_URL}/api/sandboxes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: GetSandboxesResponse = await response.json();

  if (!response.ok || data.status === "error") {
    throw new Error(data.error || "Failed to fetch sandboxes");
  }

  return data.sandboxes || [];
}
