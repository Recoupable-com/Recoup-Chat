import { useState } from "react";
import { toast } from "sonner";

interface UseCopyReturn {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

/**
 * Hook for copying text to clipboard with visual feedback
 * @param resetDelay - Time in milliseconds before resetting the copied state (default: 2000)
 * @returns Object with copied state and copy function
 */
export function useCopy(resetDelay: number = 2000): UseCopyReturn {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), resetDelay);
    } catch (error: unknown) {
      toast.error((error as Error)?.message || "Failed to copy to clipboard");
    }
  };

  return { copied, copy };
}
