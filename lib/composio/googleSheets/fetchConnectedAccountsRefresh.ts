interface FetchConnectedAccountsRefreshParams {
  accountId: string;
  redirectUrl: string;
}

interface FetchConnectedAccountsRefreshResponse {
  message: string;
  id: string;
  status: string;
  redirect_url: string;
}

export async function fetchConnectedAccountsRefresh({
  accountId,
  redirectUrl,
}: FetchConnectedAccountsRefreshParams): Promise<FetchConnectedAccountsRefreshResponse> {
  const response = await fetch(
    "https://recoup-api.vercel.app/api/connectedAccounts/refresh",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId,
        redirectUrl,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
