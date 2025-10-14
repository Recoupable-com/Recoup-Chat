"use client";

import { useState } from "react";
import { Check, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postCatalogSongs, CatalogSongInput } from "@/lib/catalog/postCatalogSongs";

export interface InsertCatalogSongsResult {
  success: boolean;
  songs?: Array<{
    isrc: string;
    catalog_id: string;
    [key: string]: unknown;
  }>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<InsertCatalogSongsResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const parseCsvFile = (text: string): CatalogSongInput[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) {
      throw new Error("CSV file must contain headers and at least one row");
    }

    // Parse header to find column indices
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const catalogIdIndex = headers.indexOf("catalog_id");
    const isrcIndex = headers.indexOf("isrc");

    if (catalogIdIndex === -1 || isrcIndex === -1) {
      throw new Error("CSV must contain 'catalog_id' and 'isrc' columns");
    }

    // Parse data rows
    const songs: CatalogSongInput[] = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",").map((cell) => cell.trim());
      if (row.length > Math.max(catalogIdIndex, isrcIndex)) {
        songs.push({
          catalog_id: row[catalogIdIndex],
          isrc: row[isrcIndex],
        });
      }
    }

    return songs;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadResult(null);

    try {
      const text = await file.text();
      const songs = parseCsvFile(text);

      if (songs.length === 0) {
        throw new Error("No valid songs found in CSV file");
      }

      const response = await postCatalogSongs(songs);

      setUploadResult({
        success: true,
        songs: response.songs,
        pagination: response.pagination,
        total_added: songs.length,
        message: `Successfully uploaded ${songs.length} song(s) from CSV`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload CSV file";
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const displayResult = uploadResult || result;
  const hasError = uploadError || (!result.success && result.error);

  return (
    <div className="flex flex-col gap-3 py-2">
      {/* Result Status */}
      <div className="flex items-center gap-2">
        {hasError ? (
          <>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-destructive/10">
              <X className="h-3 w-3 text-destructive" />
            </div>
            <span className="text-sm text-destructive">
              {uploadError || result.error}
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <span className="text-sm text-muted-foreground">
              {displayResult.message || "Songs added to catalog"}
            </span>
          </>
        )}
      </div>

      {/* Songs Added Summary */}
      {displayResult.success && displayResult.total_added !== undefined && (
        <div className="px-3 py-2 bg-muted/50 rounded-md">
          <div className="text-xs text-muted-foreground mb-1">Summary</div>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-lg font-semibold">
                {displayResult.total_added}
              </div>
              <div className="text-xs text-muted-foreground">Songs Added</div>
            </div>
            {displayResult.pagination && (
              <div>
                <div className="text-lg font-semibold">
                  {displayResult.pagination.total}
                </div>
                <div className="text-xs text-muted-foreground">Total in Catalog</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sample of Added Songs */}
      {displayResult.success && displayResult.songs && displayResult.songs.length > 0 && (
        <div className="mt-1">
          <div className="text-xs text-muted-foreground mb-2">
            Recently Added ({Math.min(5, displayResult.songs.length)} of{" "}
            {displayResult.songs.length})
          </div>
          <div className="space-y-1">
            {displayResult.songs.slice(0, 5).map((song, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-2 py-1.5 bg-muted/30 rounded text-xs"
              >
                <div className="flex-1 font-mono truncate">{song.isrc}</div>
                <div className="text-muted-foreground">→</div>
                <div className="text-muted-foreground font-mono text-[10px] truncate max-w-[120px]">
                  {song.catalog_id}
                </div>
              </div>
            ))}
          </div>
          {displayResult.songs.length > 5 && (
            <div className="text-xs text-muted-foreground mt-1 px-2">
              + {displayResult.songs.length - 5} more songs
            </div>
          )}
        </div>
      )}

      {/* CSV Upload Button */}
      <div className="mt-2 pt-3 border-t">
        <label htmlFor="csv-upload">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            className="w-full"
            onClick={() => document.getElementById("csv-upload")?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading CSV...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV File
              </>
            )}
          </Button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
        <p className="text-xs text-muted-foreground mt-1.5 px-1">
          CSV must include <code className="text-[10px] bg-muted px-1 py-0.5 rounded">catalog_id</code> and{" "}
          <code className="text-[10px] bg-muted px-1 py-0.5 rounded">isrc</code> columns
        </p>
      </div>
    </div>
  );
}

