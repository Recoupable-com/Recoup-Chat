import { useQuery } from "@tanstack/react-query";
import { getAvailableModels } from "@/lib/ai/getAvailableModels";
import { GatewayLanguageModelEntry } from "@ai-sdk/gateway";

/**
 * A thin wrapper around TanStack's useQuery to fetch the list of
 * available Large-Language-Models (LLMs).
 */
const useAvailableModels = () =>
  useQuery<GatewayLanguageModelEntry[]>({
    queryKey: ["available-models"],
    queryFn: () => getAvailableModels(),
  });

export default useAvailableModels;
