"use client";

import { CatalogSongsResponse } from "@/lib/catalog/getCatalogSongs";
import { useCatalogSongsFileSelect } from "@/hooks/useCatalogSongsFileSelect";
import { Progress } from "@/components/ui/progress";
import CatalogCsvUploadButton from "./CatalogCsvUploadButton";
import InsertCatalogSongsList from "./InsertCatalogSongsList";
import InsertCatalogSongsSummary from "./InsertCatalogSongsSummary";
import InsertCatalogSongsStatus from "./InsertCatalogSongsStatus";

export interface CatalogSongsResult {
  success: boolean;
  songs?: CatalogSongsResponse["songs"];
  pagination?: CatalogSongsResponse["pagination"];
  total_added?: number;
  message?: string;
  error?: string;
}

interface CatalogSongsResultProps {
  result: CatalogSongsResult;
}

export default function CatalogSongsResult({
  result,
}: CatalogSongsResultProps) {
  const catalogId = result.songs?.[0]?.catalog_id;
  const {
    isUploading,
    uploadResult,
    uploadError,
    uploadProgress,
    handleFileSelect,
  } = useCatalogSongsFileSelect(catalogId);

  const displayResult = uploadResult || result;
  const hasError = !!(uploadError || (!result.success && result.error));

  const progressPercentage =
    uploadProgress.total > 0
      ? (uploadProgress.current / uploadProgress.total) * 100
      : 0;

  return (
    <div className="flex flex-col gap-3 py-2">
      <InsertCatalogSongsStatus
        hasError={hasError}
        errorMessage={uploadError || result.error}
        successMessage={displayResult.message}
      />

      {/* Songs Added Summary */}
      {displayResult.success && (
        <InsertCatalogSongsSummary
          totalAdded={displayResult.total_added}
          pagination={displayResult.pagination}
        />
      )}

      {displayResult.success && displayResult.songs && (
        <div className="max-h-[60vh] overflow-y-auto">
          <InsertCatalogSongsList songs={displayResult.songs} />
        </div>
      )}

      {isUploading && uploadProgress.total > 0 ? (
        <div className="space-y-1">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {Math.round(progressPercentage)}%
          </p>
        </div>
      ) : (
        <CatalogCsvUploadButton
          onFileSelect={handleFileSelect}
          hasCatalogId={!!catalogId}
        />
      )}
    </div>
  );
}
