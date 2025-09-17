export const getActiveSubscription = async (accountId: string) => {
  try {
    const response = await fetch(
      `https://api.recoupable.com/api/subscriptions?accountId=${accountId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch active subscription:", error);
    return { error };
  }
};
