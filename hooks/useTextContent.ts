import { useQuery } from "@tanstack/react-query";
import { TEXT_EXTENSIONS } from "@/lib/consts/fileExtensions";
import { fetchFileContent } from "@/lib/files/fetchFileContent";

type UseTextContentParams = {
  url?: string | null;
  storageKey?: string | null;
  fileName?: string;
  forceTextFile?: boolean;
};

type UseTextContentResult = {
  content: string;
  loading: boolean;
  error: string | null;
  isTextFile: boolean;
};

/**
 * Unified hook to fetch text file content from either:
 * - Direct URL (for Arweave/knowledge base files)
 * - Storage key (for Supabase files)
 * 
 * Uses TanStack Query for caching and automatic refetching
 */
export function useTextContent({
  url,
  storageKey,
  fileName,
  forceTextFile = false,
}: UseTextContentParams): UseTextContentResult {
  // Determine if this is a text file
  const fileNameToCheck = fileName || url || storageKey || "";
  const detectedIsTextFile = TEXT_EXTENSIONS.some((ext) => 
    fileNameToCheck.toLowerCase().endsWith(ext)
  );
  const isTextFile = forceTextFile || detectedIsTextFile;

  // Determine query key and fetch strategy
  const isDirectUrl = !!url;
  const isStorageKey = !!storageKey;
  const shouldFetch = (isDirectUrl || isStorageKey) && isTextFile;

  const { data, isLoading, error } = useQuery({
    queryKey: isDirectUrl 
      ? ["text-content", "url", url] 
      : ["text-content", "storage", storageKey],
    queryFn: async () => {
      if (isDirectUrl && url) {
        // Fetch from direct URL (Arweave/knowledge base)
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch file");
        return response.text();
      } else if (isStorageKey && storageKey) {
        // Fetch from storage via signed URL (Supabase)
        return fetchFileContent(storageKey);
      }
      throw new Error("No URL or storage key provided");
    },
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return {
    content: data ?? "",
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : "Failed to load file") : null,
    isTextFile,
  };
}

export default useTextContent;

