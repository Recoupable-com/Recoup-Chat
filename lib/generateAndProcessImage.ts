import { Experimental_GenerateImageResult } from "ai";
import Transaction from "arweave/node/lib/transaction";
import { Address, Hash } from "viem";

interface RecoupImageGenerateResponse extends Experimental_GenerateImageResult {
  imageUrl: string;
  arweaveResult: Transaction;
  moment: {
    contractAddress: Address;
    tokenId: string;
    hash: Hash;
    chainId: number;
  };
}

export interface GeneratedImageResponse {
  base64: string | null;
}

export async function generateAndProcessImage(
  prompt: string,
  accountId: string
): Promise<GeneratedImageResponse> {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  if (!accountId) {
    throw new Error("Account ID is required");
  }

  const apiUrl = new URL("https://recoup-api.vercel.app/api/image/generate");
  apiUrl.searchParams.set("prompt", prompt);
  apiUrl.searchParams.set("account_id", accountId);

  const response = await fetch(apiUrl.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  const data: RecoupImageGenerateResponse = await response.json();

  return {
    base64: data.image?.base64 || null,
  };
}
