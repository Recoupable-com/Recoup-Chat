"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

/**
 * Banner that shows when user returns from OAuth with ?connected=true
 * Auto-dismisses after 5 seconds or on click.
 */
export function ConnectionSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if we just returned from OAuth
    if (searchParams.get("connected") === "true") {
      setShow(true);

      // Clean up URL by removing the query param
      const newUrl = pathname;
      router.replace(newUrl, { scroll: false });

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router, pathname]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/80 border border-green-200 dark:border-green-800 shadow-lg">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        <span className="text-sm font-medium text-green-800 dark:text-green-200">
          Connector enabled successfully!
        </span>
        <button
          onClick={() => setShow(false)}
          className="ml-2 p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
        >
          <X className="h-4 w-4 text-green-600 dark:text-green-400" />
        </button>
      </div>
    </div>
  );
}
