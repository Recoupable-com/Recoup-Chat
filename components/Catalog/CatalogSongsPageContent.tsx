"use client";

import useCatalogSongs from "@/hooks/useCatalogSongs";
import { CatalogSongsResponse } from "@/lib/catalog/getCatalogSongs";
import CatalogSongsResult, {
  type CatalogSongsResult as CatalogSongsResultType,
} from "@/components/VercelChat/tools/catalog/CatalogSongsResult";
import CatalogSongsSkeleton from "@/components/VercelChat/tools/catalog/CatalogSongsSkeleton";
import CatalogSongsInfiniteScrollTrigger from "./CatalogSongsInfiniteScrollTrigger";

interface CatalogSongsPageContentProps {
  catalogId: string;
}

const CatalogSongsPageContent = ({
  catalogId,
}: CatalogSongsPageContentProps) => {
  const { data, isLoading, error, isFetchingNextPage, observerTarget } =
    useCatalogSongs({
      catalogId,
      pageSize: 50,
    });

  if (isLoading) {
    return <CatalogSongsSkeleton />;
  }

  if (error || !data || !data.pages || data.pages.length === 0) {
    const errorResult: CatalogSongsResultType = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : error
            ? "Failed to load songs"
            : "No data available",
    };
    return <CatalogSongsResult result={errorResult} />;
  }

  // Flatten all pages into a single songs array
  const allSongs = data.pages.flatMap(
    (page: CatalogSongsResponse) => page.songs
  );
  const totalCount = data.pages[0].pagination.total_count;

  const result: CatalogSongsResultType = {
    success: true,
    songs: allSongs,
    pagination: {
      total_count: totalCount,
      page: data.pages.length,
      limit: 50,
      total_pages: data.pages[0].pagination.total_pages,
    },
    total_added: totalCount,
    message: `Found ${totalCount} songs in catalog`,
  };

  return (
    <div>
      <CatalogSongsResult result={result} />
      <CatalogSongsInfiniteScrollTrigger
        observerTarget={observerTarget}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
};

export default CatalogSongsPageContent;
