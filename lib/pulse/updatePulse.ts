import { NEW_API_BASE_URL } from "@/lib/consts";
import { PulseResponse } from "./getPulse";

const PULSE_API_URL = `${NEW_API_BASE_URL}/api/pulse`;

export type UpdatePulseParams = {
  accessToken: string;
  active: boolean;
  accountId?: string;
};

export async function updatePulse({
  accessToken,
  active,
  accountId,
}: UpdatePulseParams): Promise<PulseResponse> {
  const response = await fetch(PULSE_API_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": accessToken,
    },
    body: JSON.stringify({
      active,
      ...(accountId && { account_id: accountId }),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update pulse");
  }

  return response.json();
}
