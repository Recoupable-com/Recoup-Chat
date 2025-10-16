"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";

/**
 * Result type returned by the update_file tool
 */
type UpdateFileResult = {
  success: boolean;
  verified?: boolean;
  storageKey?: string;
  fileName?: string;
  sizeBytes?: number;
  path?: string;
  message?: string;
  error?: string;
};

interface UpdateFileResultProps {
  result: UpdateFileResult;
}

/**
 * Component to display update_file tool results
 * Automatically invalidates the file content cache to refresh the UI
 */
export function UpdateFileResult({ result }: UpdateFileResultProps) {
  const queryClient = useQueryClient();

  // Invalidate cache when component mounts (file was updated)
  useEffect(() => {
    if (result.success && result.storageKey) {
      // Invalidate the specific file's content cache
      queryClient.invalidateQueries({
        queryKey: ["file-content", result.storageKey],
      });
    }
  }, [result.success, result.storageKey, queryClient]);

  if (!result.success) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
        <div className="flex-1">
          <p className="text-sm text-destructive font-medium">
            {result.error || "Failed to update file"}
          </p>
          {result.message && (
            <p className="text-xs text-muted-foreground mt-1">{result.message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {result.fileName ? `Updated ${result.fileName}` : "File updated"}
        </p>
        {result.sizeBytes !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">
            {(result.sizeBytes / 1024).toFixed(2)} KB
          </p>
        )}
      </div>
    </div>
  );
}

