import { NEW_API_BASE_URL } from "@/lib/consts";

const PULSE_API_URL = `${NEW_API_BASE_URL}/api/pulse`;

export type PulseResponse = {
  status: "success";
  pulse: {
    id: string;
    account_id: string;
    active: boolean;
  };
};

export type GetPulseParams = {
  accessToken: string;
  accountId?: string;
};

export async function getPulse({
  accessToken,
  accountId,
}: GetPulseParams): Promise<PulseResponse> {
  const url = new URL(PULSE_API_URL);
  if (accountId) {
    url.searchParams.set("account_id", accountId);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-api-key": accessToken,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get pulse");
  }

  return response.json();
}
