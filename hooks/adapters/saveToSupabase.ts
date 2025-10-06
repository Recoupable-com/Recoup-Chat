import { toast } from "sonner";
import { updateFileContent } from "@/lib/files/updateFileContent";
import getMimeFromPath from "@/utils/getMimeFromPath";
import { getContentSizeBytes } from "@/utils/getContentSizeBytes";
import { MAX_TEXT_FILE_SIZE_BYTES } from "@/lib/consts/fileConstants";
import type { QueryClient } from "@tanstack/react-query";

export type SupabaseSaveParams = {
  content: string;
  storageKey: string;
  fileName: string;
  ownerAccountId: string;
  artistAccountId: string;
  mimeType?: string | null;
  queryClient: QueryClient;
};

/**
 * Save text content to Supabase (for file management)
 */
export async function saveToSupabase(params: SupabaseSaveParams): Promise<boolean> {
  try {
    // Validate file size
    const contentSize = getContentSizeBytes(params.content);
    if (contentSize > MAX_TEXT_FILE_SIZE_BYTES) {
      toast.error(
        `File size exceeds 10MB limit. Current size: ${(
          contentSize / 1024 / 1024
        ).toFixed(2)}MB`
      );
      return false;
    }

    // Update file in Supabase
    await updateFileContent({
      storageKey: params.storageKey,
      content: params.content,
      mimeType: params.mimeType || getMimeFromPath(params.fileName),
      ownerAccountId: params.ownerAccountId,
      artistAccountId: params.artistAccountId,
    });

    // Invalidate file content cache
    await params.queryClient.invalidateQueries({
      queryKey: ["text-content", "storage", params.storageKey],
    });

    toast.success("File saved successfully");
    return true;
  } catch (error) {
    console.error("Supabase save failed:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to save file"
    );
    return false;
  }
}

