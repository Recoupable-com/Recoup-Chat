import {
  useInfiniteQuery,
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import {
  CatalogSongsResponse,
  getCatalogSongs,
} from "@/lib/catalog/getCatalogSongs";
import useObserverTarget from "./useObserverTarget";
import { RefObject, useRef, useEffect, useState } from "react";

interface UseCatalogSongsOptions {
  catalogId: string;
  pageSize?: number;
  enabled?: boolean;
  artistName?: string;
}

type UseCatalogSongsReturn = UseInfiniteQueryResult<
  InfiniteData<CatalogSongsResponse>
> & {
  observerTarget: RefObject<HTMLDivElement>;
};

const useCatalogSongs = ({
  catalogId,
  pageSize = 50,
  enabled = true,
  artistName,
}: UseCatalogSongsOptions): UseCatalogSongsReturn => {
  // Track effective filter after fallback check
  const [effectiveFilter, setEffectiveFilter] = useState<string | undefined>(
    artistName
  );
  const hasCheckedFallback = useRef(false);

  // Reset when artistName changes
  useEffect(() => {
    setEffectiveFilter(artistName);
    hasCheckedFallback.current = false;
  }, [artistName]);

  const queryResult = useInfiniteQuery({
    queryKey: ["catalogSongs", catalogId, pageSize, effectiveFilter],
    queryFn: async ({ pageParam = 1 }) => {
      // On first page, check if we need to fallback
      if (
        artistName &&
        effectiveFilter === artistName &&
        pageParam === 1 &&
        !hasCheckedFallback.current
      ) {
        const result = await getCatalogSongs(
          catalogId,
          pageSize,
          pageParam,
          artistName
        );

        // If filter returns zero results, update effective filter and retry without filter
        if (result.pagination.total_count === 0) {
          hasCheckedFallback.current = true;
          setEffectiveFilter(undefined);
          return await getCatalogSongs(catalogId, pageSize, pageParam);
        }

        hasCheckedFallback.current = true;
        return result;
      }

      // Use effective filter for all requests (including pagination)
      return await getCatalogSongs(
        catalogId,
        pageSize,
        pageParam,
        effectiveFilter
      );
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

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = queryResult;

  const observerTarget = useObserverTarget({
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  return {
    ...queryResult,
    observerTarget,
  };
};

export default useCatalogSongs;
