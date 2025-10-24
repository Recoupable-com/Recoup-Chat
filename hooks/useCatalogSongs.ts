import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getCatalogSongs,
  CatalogSongsResponse,
} from "@/lib/catalog/getCatalogSongs";

interface UseCatalogSongsOptions {
  catalogId: string;
  pageSize?: number;
  page?: number;
  enabled?: boolean;
}

const useCatalogSongs = ({
  catalogId,
  pageSize = 1,
  page = 1,
  enabled = true,
}: UseCatalogSongsOptions): UseQueryResult<CatalogSongsResponse> => {
  return useQuery({
    queryKey: ["catalogSongs", catalogId, pageSize, page],
    queryFn: () => getCatalogSongs(catalogId, pageSize, page),
    enabled: enabled && !!catalogId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useCatalogSongs;
