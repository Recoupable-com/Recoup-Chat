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
  const headers = useCallback(async (): Promise<HeadersInit | undefined> => {
    const token = await getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }, [getAccessToken]);

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: `${baseUrl}/api/chat`,
      headers,
    });
  }, [baseUrl, headers]);

  return { transport };
}
