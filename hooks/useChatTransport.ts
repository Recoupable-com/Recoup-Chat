import { useMemo } from "react";
import { DefaultChatTransport } from "ai";
import { NEW_API_BASE_URL } from "@/lib/consts";
import { useAccessToken } from "./useAccessToken";

export function useChatTransport() {
  const accessToken = useAccessToken();

  const headers = useMemo(() => {
    return accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined;
  }, [accessToken]);

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: `${NEW_API_BASE_URL}/api/chat`,
      ...(headers && { headers }),
    });
  }, [headers]);

  return { transport, headers, accessToken };
}
