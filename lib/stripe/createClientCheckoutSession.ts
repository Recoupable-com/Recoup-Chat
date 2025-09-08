import { createSession } from "./createSession";
import { v4 as uuidV4 } from "uuid";

const createClientCheckoutSession = async (accountId: string) => {
  const referenceId = uuidV4();
  const sessionResponse = await createSession(
    `${window.location.href}?referenceId=${referenceId}`,
    "Recoup Pro",
    referenceId,
    {
      accountId,
    }
  );

  window.open(sessionResponse.url, "_self");
};

export default createClientCheckoutSession;
