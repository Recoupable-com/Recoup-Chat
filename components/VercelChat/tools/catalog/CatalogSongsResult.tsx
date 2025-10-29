"use client";

import { CatalogSongsResponse } from "@/lib/catalog/getCatalogSongs";
import { useCatalogSongsFileSelect } from "@/hooks/useCatalogSongsFileSelect";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CatalogCsvUploadButton from "./CatalogCsvUploadButton";
import InsertCatalogSongsList from "./InsertCatalogSongsList";
import InsertCatalogSongsSummary from "./InsertCatalogSongsSummary";
import InsertCatalogSongsStatus from "./InsertCatalogSongsStatus";
import { useMemo, useState } from "react";

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

  const [hideIncomplete, setHideIncomplete] = useState(true);

  const isComplete = (song: CatalogSongsResponse["songs"][0]) => {
    const hasTitle = !!song.name && song.name.trim().length > 0;
    const hasIsrc = !!song.isrc && song.isrc.trim().length > 0;
    const hasAlbum = !!song.album && song.album.trim().length > 0;
    const hasArtist = Array.isArray(song.artists)
      ? song.artists.some((a) => !!a?.name && a.name.trim().length > 0)
      : false;
    return hasTitle && hasArtist && hasAlbum && hasIsrc;
  };

  const filteredSongs = useMemo(() => {
    const songs = displayResult.songs || [];
    return hideIncomplete ? songs.filter(isComplete) : songs;
  }, [displayResult.songs, hideIncomplete]);

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
        <div className="flex items-center justify-between px-1">
          <div className="text-xs text-muted-foreground">
            {hideIncomplete
              ? `Hiding items with missing info`
              : `Showing all items`}
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="hide-incomplete" className="text-xs">
              Hide items with missing info
            </Label>
            <Switch
              id="hide-incomplete"
              checked={hideIncomplete}
              onCheckedChange={setHideIncomplete}
            />
          </div>
        </div>
      )}

      {displayResult.success && displayResult.songs && (
        <div className="max-h-[60vh] overflow-y-auto">
          <InsertCatalogSongsList songs={filteredSongs} />
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
