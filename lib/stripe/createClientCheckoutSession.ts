import { fetchCheckoutSession } from "./fetchCheckoutSession";

const createClientCheckoutSession = async (accountId: string) => {
  const sessionResponse = await fetchCheckoutSession(accountId);
  window.open(sessionResponse.url, "_self");
};

export default createClientCheckoutSession;
