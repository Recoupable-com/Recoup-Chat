import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CatalogCsvUploadButtonProps {
  isUploading: boolean;
  uploadProgress: { current: number; total: number };
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasCatalogId?: boolean;
}

/**
 * CSV file upload button for catalog songs
 * Accepts CSV files with isrc column (case-insensitive)
 * catalog_id is automatically used from the selected catalog
 */
export default function CatalogCsvUploadButton({
  isUploading,
  uploadProgress,
  onFileSelect,
  hasCatalogId = true,
}: CatalogCsvUploadButtonProps) {
  const progressPercentage =
    uploadProgress.total > 0
      ? (uploadProgress.current / uploadProgress.total) * 100
      : 0;

  return (
    <div className="mt-2 pt-3 border-t">
      {!isUploading ? (
        <label htmlFor="csv-upload">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading || !hasCatalogId}
            className="w-full"
            onClick={() => document.getElementById("csv-upload")?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV File
          </Button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={onFileSelect}
            className="hidden"
          />
        </label>
      ) : (
        <div className="mt-2 space-y-1">
          <Progress value={progressPercentage} className="h-2" />
        </div>
      )}
      {!isUploading && (
        <p className="text-xs text-muted-foreground mt-1.5 px-1">
          {hasCatalogId ? (
            <>
              CSV must include an{" "}
              <code className="text-[10px] bg-muted px-1 py-0.5 rounded">
                isrc
              </code>{" "}
              column (case-insensitive)
            </>
          ) : (
            <>
              <span className="text-destructive">
                No catalog selected. Please select a catalog first.
              </span>
            </>
          )}
        </p>
      )}
    </div>
  );
}
