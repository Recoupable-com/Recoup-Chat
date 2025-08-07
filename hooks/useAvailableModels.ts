import { useQuery } from "@tanstack/react-query";
import { getAvailableModels, LlmModel } from "@/lib/ai/getAvailableModels";

/**
 * A thin wrapper around TanStack's useQuery to fetch the list of
 * available Large-Language-Models (LLMs). The data is static and
 * therefore cached indefinitely by default.
 */
const useAvailableModels = () =>
  useQuery<LlmModel[]>({
    queryKey: ["available-models"],
    queryFn: () => getAvailableModels(),
    // Since the list is static, we don't need to refetch automatically.
    // Users can still manually invalidate this query if models change.
    staleTime: Infinity,
    gcTime: Infinity,
  });

export default useAvailableModels;
