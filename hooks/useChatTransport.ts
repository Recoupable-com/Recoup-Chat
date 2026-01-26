import { useCallback, useMemo } from "react";
import { DefaultChatTransport } from "ai";
import { usePrivy } from "@privy-io/react-auth";
import { NEW_API_BASE_URL } from "@/lib/consts";
import { useApiOverride } from "./useApiOverride";

export function useChatTransport() {
  const { getAccessToken } = usePrivy();
  const apiOverride = useApiOverride();

  const baseUrl = apiOverride || NEW_API_BASE_URL;

  // Fetch a fresh token per request to avoid stale auth headers.
  // Throws if token is unavailable to prevent unauthenticated requests.
  const headers = useCallback(async (): Promise<Record<string, string>> => {
    console.log("[DEBUG] useChatTransport: Fetching token...");
    const startTime = Date.now();
    const token = await getAccessToken();
    const elapsed = Date.now() - startTime;
    console.log("[DEBUG] useChatTransport: Token result:", {
      hasToken: !!token,
      tokenLength: token?.length,
      elapsedMs: elapsed,
    });
    if (!token) {
      throw new Error("Authentication token not available. Please wait and try again.");
    }
    return { Authorization: `Bearer ${token}` };
  }, [getAccessToken]);

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: `${baseUrl}/api/chat`,
      headers,
    });
  }, [baseUrl, headers]);

  return { transport };
}
