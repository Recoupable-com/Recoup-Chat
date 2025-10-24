import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";
import {
  CatalogSongsResponse,
  getCatalogSongs,
} from "@/lib/catalog/getCatalogSongs";

interface UseCatalogSongsOptions {
  catalogId: string;
  pageSize?: number;
  enabled?: boolean;
}

const useCatalogSongs = ({
  catalogId,
  pageSize = 50,
  enabled = true,
}: UseCatalogSongsOptions): UseInfiniteQueryResult<
  InfiniteData<CatalogSongsResponse>
> => {
  return useInfiniteQuery({
    queryKey: ["catalogSongs", catalogId, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getCatalogSongs(catalogId, pageSize, pageParam);
      return result;
    },
    enabled: enabled && !!catalogId,
    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.pagination;
      const nextPage = page < total_pages ? page + 1 : undefined;
      return nextPage;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useCatalogSongs;
