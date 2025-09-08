export const fetchCheckoutSession = async (accountId: string) => {
  try {
    const response = await fetch(`/api/stripe/session/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId,
      }),
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    return { error };
  }
};
