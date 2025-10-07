import { toast } from "sonner";
import { uploadFile } from "@/lib/arweave/uploadToArweave";
import getMimeFromPath from "@/utils/getMimeFromPath";
import type { QueryClient } from "@tanstack/react-query";

export type ArweaveSaveParams = {
  content: string;
  fileName: string;
  originalUrl: string;
  onSuccess: (newUrl: string) => Promise<void>;
  queryClient: QueryClient;
};

/**
 * Save text content to Arweave (for knowledge base files)
 */
export async function saveToArweave(params: ArweaveSaveParams): Promise<boolean> {
  try {
    // Validate JSON if applicable
    const mime = getMimeFromPath(params.fileName);
    if (mime === "application/json") {
      try {
        JSON.parse(params.content);
      } catch {
        toast.info("Invalid JSON; saving as-is");
      }
    }

    // Upload to Arweave
    const file = new File([params.content], params.fileName, { type: mime });
    const { uri } = await uploadFile(file);

    // Call success handler to update knowledge base
    await params.onSuccess(uri);

    // Invalidate artist knowledge queries
    await params.queryClient.invalidateQueries({ 
      queryKey: ["artist-knowledge"] 
    });
    await params.queryClient.invalidateQueries({ 
      queryKey: ["artist-knowledge-text"] 
    });

    toast.success("Saved");
    return true;
  } catch (error) {
    console.error("Arweave save failed:", error);
    toast.error("Failed to save changes");
    return false;
  }
}

