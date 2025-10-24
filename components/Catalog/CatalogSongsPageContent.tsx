"use client";

import useCatalogSongs from "@/hooks/useCatalogSongs";
import CatalogSongsResult, {
  CatalogSongsResult as CatalogSongsResultType,
} from "@/components/VercelChat/tools/catalog/CatalogSongsResult";
import CatalogSongsSkeleton from "@/components/VercelChat/tools/catalog/CatalogSongsSkeleton";

interface CatalogSongsPageContentProps {
  catalogId: string;
}

const CatalogSongsPageContent = ({
  catalogId,
}: CatalogSongsPageContentProps) => {
  const { data, isLoading, error } = useCatalogSongs({
    catalogId,
    pageSize: 100,
    page: 1,
  });

  if (isLoading) {
    return <CatalogSongsSkeleton />;
  }

  if (error) {
    const errorResult: CatalogSongsResultType = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load songs",
    };
    return <CatalogSongsResult result={errorResult} />;
  }

  if (!data) {
    const emptyResult: CatalogSongsResultType = {
      success: false,
      error: "No data available",
    };
    return <CatalogSongsResult result={emptyResult} />;
  }

  const result: CatalogSongsResultType = {
    success: true,
    songs: data.songs,
    pagination: data.pagination,
    total_added: data.pagination.total_count,
    message: `Found ${data.pagination.total_count} songs in catalog`,
  };

  return <CatalogSongsResult result={result} />;
};

export default CatalogSongsPageContent;
