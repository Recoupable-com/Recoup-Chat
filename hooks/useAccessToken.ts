import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

/**
 * Small SRP hook to expose the current Privy access token
 * as React state. It automatically refreshes when the
 * underlying Privy client changes.
 */
export function useAccessToken(): string | null {
  const { getAccessToken } = usePrivy();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadToken = async () => {
      try {
        const token = await getAccessToken();
        if (!cancelled) {
          setAccessToken(token ?? null);
        }
      } catch (e) {
        console.error("Failed to get Privy access token:", e);
        if (!cancelled) {
          setAccessToken(null);
        }
      }
    };

    void loadToken();

    return () => {
      cancelled = true;
    };
  }, [getAccessToken]);

  return accessToken;
}
