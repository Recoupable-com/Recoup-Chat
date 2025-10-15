import { CatalogSongsResponse } from "@/lib/catalog/getCatalogSongs";

interface InsertCatalogSongsSummaryProps {
  totalAdded?: number;
  pagination?: CatalogSongsResponse["pagination"];
}

/**
 * Displays a summary of catalog song insertion results
 * Shows number of songs added and total catalog count
 */
export default function InsertCatalogSongsSummary({
  totalAdded,
  pagination,
}: InsertCatalogSongsSummaryProps) {
  if (totalAdded === undefined) return null;

  return (
    <div className="px-3 py-2 bg-muted/50 rounded-md">
      <div className="text-xs text-muted-foreground mb-1">Summary</div>
      <div className="flex items-center gap-4">
        <div>
          <div className="text-lg font-semibold">{totalAdded}</div>
          <div className="text-xs text-muted-foreground">Songs Added</div>
        </div>
        {pagination && (
          <div>
            <div className="text-lg font-semibold">
              {pagination.total_count}
            </div>
            <div className="text-xs text-muted-foreground">
              Total in Catalog
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
