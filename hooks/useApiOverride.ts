import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const STORAGE_KEY = "recoup_api_override";

/**
 * Hook to read and persist API URL override from query params.
 * Use `?api=<url>` to override the API base URL.
 * Use `?api=clear` to clear the override.
 * The override persists in sessionStorage across navigations.
 */
export function useApiOverride() {
  const searchParams = useSearchParams();
  const [apiOverride, setApiOverride] = useState<string | null>(() => {
    // Initialize from sessionStorage on client
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(STORAGE_KEY);
    }
    return null;
  });

  useEffect(() => {
    // Check query param first
    const apiParam = searchParams.get("api");

    if (apiParam === "clear") {
      // Clear the override
      sessionStorage.removeItem(STORAGE_KEY);
      setApiOverride(null);
      return;
    }

    if (apiParam) {
      // Use the URL as-is, let the transport layer handle any errors
      sessionStorage.setItem(STORAGE_KEY, apiParam);
      setApiOverride(apiParam);
      return;
    }

    // Fall back to stored value if no query param
    if (!apiParam) {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setApiOverride(stored);
      }
    }
  }, [searchParams]);

  return apiOverride;
}
