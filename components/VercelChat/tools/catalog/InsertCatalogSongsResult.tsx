"use client";

import { CatalogSongsResponse } from "@/lib/catalog/getCatalogSongs";
import { useCatalogSongsFileSelect } from "@/hooks/useCatalogSongsFileSelect";
import CatalogCsvUploadButton from "./CatalogCsvUploadButton";
import InsertCatalogSongsList from "./InsertCatalogSongsList";
import InsertCatalogSongsSummary from "./InsertCatalogSongsSummary";
import InsertCatalogSongsStatus from "./InsertCatalogSongsStatus";

export interface InsertCatalogSongsResult {
  success: boolean;
  songs?: CatalogSongsResponse["songs"];
  pagination?: CatalogSongsResponse["pagination"];
  total_added?: number;
  message?: string;
  error?: string;
}

interface InsertCatalogSongsResultProps {
  result: InsertCatalogSongsResult;
}

export default function InsertCatalogSongsResult({
  result,
}: InsertCatalogSongsResultProps) {
  const { isUploading, uploadResult, uploadError, handleFileSelect } =
    useCatalogSongsFileSelect();

  const displayResult = uploadResult || result;
  const hasError = !!(uploadError || (!result.success && result.error));

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
        <InsertCatalogSongsList songs={displayResult.songs} />
      )}

      <CatalogCsvUploadButton
        isUploading={isUploading}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}
