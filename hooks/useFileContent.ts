import { useQuery } from "@tanstack/react-query";
import { TEXT_EXTENSIONS } from "@/lib/consts/fileExtensions";
import { fetchFileContent } from "@/lib/files/fetchFileContent";

type UseFileContentResult = {
  content: string | null;
  loading: boolean;
  error: string | null;
  isTextFile: boolean;
};

/**
 * Hook to fetch and manage text file content using TanStack Query
 */
export function useFileContent(fileName: string, storageKey: string): UseFileContentResult {
  const isTextFile = TEXT_EXTENSIONS.some((ext) => fileName.toLowerCase().endsWith(ext));

  const { data, isLoading, error } = useQuery({
    queryKey: ["file-content", storageKey],
    queryFn: () => fetchFileContent(storageKey),
    enabled: isTextFile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    content: data ?? null,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : "Failed to load file") : null,
    isTextFile,
  };
}

