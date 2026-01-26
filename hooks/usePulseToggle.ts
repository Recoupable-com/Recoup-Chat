import { useState, useEffect, useCallback } from "react";
import { useUserProvider } from "@/providers/UserProvder";
import { useAccessToken } from "@/hooks/useAccessToken";
import { toast } from "sonner";

export function usePulseToggle() {
  const { userData } = useUserProvider();
  const accessToken = useAccessToken();
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPulseStatus = useCallback(async () => {
    if (!accessToken) return;

    try {
      const url = new URL("/api/pulse", window.location.origin);
      if (userData?.account_id) {
        url.searchParams.set("account_id", userData.account_id);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.pulse) {
          setActive(data.pulse.active);
        }
      }
    } catch {
      // Silently fail - pulse might not exist yet
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, userData?.account_id]);

  useEffect(() => {
    fetchPulseStatus();
  }, [fetchPulseStatus]);

  const togglePulse = async (nextActive: boolean) => {
    if (isLoading || !accessToken) return;

    setIsLoading(true);
    const previousActive = active;
    setActive(nextActive);

    try {
      const response = await fetch("/api/pulse", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          active: nextActive,
          accountId: userData?.account_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update pulse");
      }

      toast.success(nextActive ? "Pulse activated" : "Pulse deactivated");
    } catch {
      setActive(previousActive);
      toast.error("Failed to update pulse status");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    active,
    isLoading,
    togglePulse,
  };
}
