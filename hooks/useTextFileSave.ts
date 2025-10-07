import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { saveToArweave } from "./adapters/saveToArweave";
import { saveToSupabase } from "./adapters/saveToSupabase";

// Arweave save configuration (for knowledge base)
type ArweaveSaveConfig = {
  type: "arweave";
  fileName: string;
  originalUrl: string;
  onSuccess: (newUrl: string) => Promise<void>;
};

// Supabase save configuration (for files)
type SupabaseSaveConfig = {
  type: "supabase";
  storageKey: string;
  fileName: string;
  ownerAccountId: string;
  artistAccountId: string;
  mimeType?: string | null;
};

type SaveConfig = ArweaveSaveConfig | SupabaseSaveConfig;

/**
 * Unified hook for saving text file edits
 * Supports both Arweave (knowledge base) and Supabase (files) backends
 */
export function useTextFileSave(config: SaveConfig) {
  const queryClient = useQueryClient();

  const handleSave = useCallback(
    async (content: string): Promise<boolean> => {
      if (config.type === "arweave") {
        return saveToArweave({
          content,
          fileName: config.fileName,
          originalUrl: config.originalUrl,
          onSuccess: config.onSuccess,
          queryClient,
        });
      } else {
        return saveToSupabase({
          content,
          storageKey: config.storageKey,
          fileName: config.fileName,
          ownerAccountId: config.ownerAccountId,
          artistAccountId: config.artistAccountId,
          mimeType: config.mimeType,
          queryClient,
        });
      }
    },
    [config, queryClient]
  );

  return { handleSave };
}

export default useTextFileSave;

