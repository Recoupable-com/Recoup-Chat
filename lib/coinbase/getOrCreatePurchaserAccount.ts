import { Account, toAccount } from "viem/accounts";
import { CdpClient } from "@coinbase/cdp-sdk";

let cdp: CdpClient | null = null;

function getCdpClient() {
  if (!cdp) {
    cdp = new CdpClient();
  }
  return cdp;
}

export async function getOrCreatePurchaserAccount(): Promise<Account> {
  const cdpClient = getCdpClient();
  const account = await cdpClient.evm.getOrCreateAccount({
    name: "Purchaser",
  });

  return toAccount(account);
}
