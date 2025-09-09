const createClientCheckoutSession = async (accountId: string) => {
  try {
    const response = await fetch(`/api/stripe/session/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId,
        successUrl: `${window.location.href}`,
      }),
    });

    const data = await response.json();
    window.open(data.data.url, "__blank");
  } catch (error) {
    return { error };
  }
};

export default createClientCheckoutSession;
