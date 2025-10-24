import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getCatalogSongs,
  CatalogSongsResponse,
} from "@/lib/catalog/getCatalogSongs";

const useCatalogSongs = (
  catalogId: string,
  enabled: boolean = true
): UseQueryResult<CatalogSongsResponse> => {
  return useQuery({
    queryKey: ["catalogSongs", catalogId],
    queryFn: () => getCatalogSongs(catalogId, 1, 1), // Fetch only 1 song to get total_count
    enabled: enabled && !!catalogId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useCatalogSongs;

